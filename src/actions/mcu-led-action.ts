import { KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

import { Buttons } from "../mcu/constants";
import type { McuSurface } from "../mcu/surface";

/**
 * Base for actions that map one Stream Deck key to one MCU button, mirroring
 * Logic's LED for that button as the key state. State is never guessed
 * locally — it always comes from Logic's feedback.
 */
export class McuLedAction extends SingletonAction {
  constructor(
    protected readonly surface: McuSurface,
    protected readonly button: number
  ) {
    super();
    this.surface.on("led", (note, on) => {
      if (note === this.button) void this.sync(on);
    });
  }

  override async onWillAppear(ev: WillAppearEvent): Promise<void> {
    if (ev.action.isKey()) {
      await ev.action.setState(this.surface.ledState(this.button) ? 1 : 0);
    }
  }

  override async onKeyDown(_ev: KeyDownEvent): Promise<void> {
    this.surface.tap(this.button);
  }

  private async sync(on: boolean): Promise<void> {
    for (const visible of this.actions) {
      if (visible.isKey()) await visible.setState(on ? 1 : 0);
    }
  }
}

/**
 * Variant for the shuttle buttons (rewind / fast-forward): the MCU press is
 * sent on key-down and the release on key-up. Logic latches the shuttle
 * rather than stopping it on release, so if playback was running when the
 * key went down, a PLAY tap on release drops back to normal speed.
 */
export class McuHoldAction extends McuLedAction {
  private resumePlayback = false;

  override async onKeyDown(_ev: KeyDownEvent): Promise<void> {
    this.resumePlayback = this.surface.ledState(Buttons.PLAY);
    this.surface.press(this.button);
  }

  override async onKeyUp(_ev: KeyUpEvent): Promise<void> {
    this.surface.release(this.button);
    // Logic latches the shuttle on release, so send an explicit stopper:
    // PLAY resumes normal speed if playback was running, otherwise a single
    // STOP halts the shuttle (a lone STOP while stopped is a no-op — the
    // jump-to-start needs two consecutive stops).
    if (this.resumePlayback) {
      this.resumePlayback = false;
      this.surface.tap(Buttons.PLAY);
    } else {
      this.surface.tap(Buttons.STOP);
    }
  }
}
