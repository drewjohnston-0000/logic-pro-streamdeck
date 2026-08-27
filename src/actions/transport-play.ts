import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

import { Buttons } from "../mcu/constants";
import type { McuSurface } from "../mcu/surface";

/**
 * Play/Stop toggle for Logic Pro. Sends the MCU PLAY button; key state is
 * driven entirely by Logic's PLAY LED feedback, so the key stays truthful
 * even when playback is started from Logic itself.
 */
@action({ UUID: "com.drewjohnston.logic-pro.transport-play" })
export class TransportPlay extends SingletonAction {
  constructor(private readonly surface: McuSurface) {
    super();
    this.surface.on("led", (note, on) => {
      if (note === Buttons.PLAY) void this.setPlaying(on);
    });
  }

  override async onWillAppear(ev: WillAppearEvent): Promise<void> {
    if (ev.action.isKey()) {
      await ev.action.setState(this.surface.ledState(Buttons.PLAY) ? 1 : 0);
    }
  }

  override async onKeyDown(_ev: KeyDownEvent): Promise<void> {
    this.surface.tap(Buttons.PLAY);
  }

  private async setPlaying(on: boolean): Promise<void> {
    for (const visible of this.actions) {
      if (visible.isKey()) await visible.setState(on ? 1 : 0);
    }
  }
}
