import { KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

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
 * Variant for rewind / fast-forward as discrete bar jumps. Logic's MCU
 * shuttle latches and fights running playback, so instead each press taps
 * the shuttle button for a single step (one bar) and immediately halts it:
 * PLAY resumes normal speed if playback was running (a lone PLAY after a
 * shuttle tap resumes rather than restarts), otherwise a single STOP stops
 * the shuttle (the jump-to-start needs two consecutive stops, so one is
 * safe).
 */
export class McuJumpAction extends McuLedAction {
  override async onKeyDown(_ev: KeyDownEvent): Promise<void> {
    const wasPlaying = this.surface.ledState(Buttons.PLAY);
    this.surface.tap(this.button);
    this.surface.tap(wasPlaying ? Buttons.PLAY : Buttons.STOP);
  }
}
