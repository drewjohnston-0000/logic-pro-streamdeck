import * as midi from "@julusian/midi";
import { EventEmitter } from "node:events";

import { LCD_COLUMNS, LCD_ROWS, SYSEX_HEADER, Sysex, type McuButton } from "./constants";

export interface McuSurfaceEvents {
  /** Logic set an LED (transport, cycle, click, mute/solo/arm, ...). */
  led: [note: number, on: boolean, velocity: number];
  /** A row of the virtual MCU LCD changed (track names / values). */
  lcd: [row: number, text: string];
  /** Raw fader position from Logic (channel 0-8, 14-bit value). */
  fader: [channel: number, value: number];
  /** Port opened and ready. */
  started: [];
  error: [error: Error];
}

/**
 * Emulates a Mackie Control Universal surface on a pair of virtual CoreMIDI
 * ports. Logic Pro connects to it via Control Surfaces > Setup (see
 * docs/logic-setup.md) and then streams LED / LCD / fader state to us while
 * we send it button presses.
 */
export class McuSurface extends EventEmitter<McuSurfaceEvents> {
  static readonly PORT_NAME = "SD Logic Control";

  private input?: midi.Input;
  private output?: midi.Output;

  /** Last known LED state by note number, so late-appearing actions can sync. */
  private readonly leds = new Map<number, boolean>();
  /** Main LCD contents, 2 rows × 56 chars. */
  private readonly lcd: string[] = Array.from({ length: LCD_ROWS }, () => " ".repeat(LCD_COLUMNS));

  start(): void {
    if (this.input) return;

    this.input = new midi.Input();
    this.output = new midi.Output();

    // Receive everything, including sysex (LCD text) — ignore only MIDI clock.
    this.input.ignoreTypes(false, true, true);
    this.input.on("message", (_delta, message) => {
      try {
        this.onMessage(message);
      } catch (err) {
        this.emit("error", err instanceof Error ? err : new Error(String(err)));
      }
    });

    // From Logic's point of view: our virtual input is where it sends surface
    // feedback, our virtual output is where button presses come from.
    this.input.openVirtualPort(McuSurface.PORT_NAME);
    this.output.openVirtualPort(McuSurface.PORT_NAME);
    this.emit("started");
  }

  stop(): void {
    this.input?.closePort();
    this.output?.closePort();
    this.input = undefined;
    this.output = undefined;
  }

  /** Momentary button: press followed by release. */
  tap(button: McuButton | number): void {
    this.press(button);
    this.release(button);
  }

  press(button: McuButton | number): void {
    this.output?.sendMessage([0x90, button, 0x7f]);
  }

  release(button: McuButton | number): void {
    this.output?.sendMessage([0x90, button, 0x00]);
  }

  ledState(note: number): boolean {
    return this.leds.get(note) ?? false;
  }

  lcdRow(row: number): string {
    return this.lcd[row] ?? "";
  }

  private onMessage(message: number[]): void {
    const [status] = message;

    if (status === 0xf0) {
      this.onSysex(message);
      return;
    }

    const type = status & 0xf0;
    if (type === 0x90) {
      const [, note, velocity] = message;
      const on = velocity > 0;
      this.leds.set(note, on);
      this.emit("led", note, on, velocity);
    } else if (type === 0xe0) {
      const channel = status & 0x0f;
      const [, lsb, msb] = message;
      this.emit("fader", channel, (msb << 7) | lsb);
    }
    // Channel pressure (0xd0, VU meters) and CC (0xb0, 7-segment timecode)
    // are intentionally ignored until an action needs them.
  }

  private onSysex(message: number[]): void {
    if (!SYSEX_HEADER.every((byte, i) => message[i] === byte)) return;

    const command = message[SYSEX_HEADER.length];
    const body = message.slice(SYSEX_HEADER.length + 1, -1);

    switch (command) {
      case Sysex.DEVICE_QUERY:
        // Identify ourselves so hosts probing for a surface find one. Serial
        // is arbitrary; Logic does not verify it.
        this.sendSysex([Sysex.HOST_CONNECTION_QUERY, ...this.serial(), 0x01, 0x02, 0x03, 0x04]);
        break;
      case Sysex.HOST_CONNECTION_REPLY:
        // The device is expected to verify the host's challenge response; we
        // accept anything and confirm the connection.
        this.sendSysex([Sysex.HOST_CONNECTION_CONFIRMATION, ...this.serial()]);
        break;
      case Sysex.LCD_WRITE:
        this.onLcdWrite(body);
        break;
    }
  }

  private onLcdWrite(body: number[]): void {
    const [offset, ...chars] = body;
    if (offset === undefined) return;

    const text = String.fromCharCode(...chars);
    const flat = this.lcd.join("");
    const updated = (flat.slice(0, offset) + text + flat.slice(offset + text.length))
      .padEnd(LCD_ROWS * LCD_COLUMNS)
      .slice(0, LCD_ROWS * LCD_COLUMNS);

    for (let row = 0; row < LCD_ROWS; row++) {
      const next = updated.slice(row * LCD_COLUMNS, (row + 1) * LCD_COLUMNS);
      if (next !== this.lcd[row]) {
        this.lcd[row] = next;
        this.emit("lcd", row, next);
      }
    }
  }

  private sendSysex(payload: number[]): void {
    this.output?.sendMessage([...SYSEX_HEADER, ...payload, 0xf7]);
  }

  private serial(): number[] {
    return [..."SDLGC01"].map((c) => c.charCodeAt(0) & 0x7f);
  }
}
