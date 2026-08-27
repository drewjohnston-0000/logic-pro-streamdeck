import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

import { KeyCodes, sendKeyToLogic } from "../keystrokes";
import { Buttons } from "../mcu/constants";
import type { McuSurface } from "../mcu/surface";

/**
 * A channel-strip button (mute/solo/arm) that follows the selected track:
 * presses go to `base + selected bank channel`, and the key state mirrors
 * that channel's LED — re-synced whenever Logic moves the selection.
 */
class SelectedTrackToggle extends SingletonAction {
  constructor(
    protected readonly surface: McuSurface,
    private readonly base: number
  ) {
    super();
    this.surface.on("led", (note, on) => {
      if (note === this.note()) void this.sync(on);
    });
    this.surface.on("selection", () => void this.sync(this.surface.ledState(this.note())));
  }

  private note(): number {
    return this.base + this.surface.selectedChannel;
  }

  override async onWillAppear(ev: WillAppearEvent): Promise<void> {
    if (ev.action.isKey()) {
      await ev.action.setState(this.surface.ledState(this.note()) ? 1 : 0);
    }
  }

  override async onKeyDown(_ev: KeyDownEvent): Promise<void> {
    this.surface.tap(this.note());
  }

  private async sync(on: boolean): Promise<void> {
    for (const visible of this.actions) {
      if (visible.isKey()) await visible.setState(on ? 1 : 0);
    }
  }
}

@action({ UUID: "com.drewjohnston.logic-pro.track-mute" })
export class TrackMute extends SelectedTrackToggle {
  constructor(surface: McuSurface) {
    super(surface, Buttons.MUTE_BASE);
  }
}

@action({ UUID: "com.drewjohnston.logic-pro.track-solo" })
export class TrackSolo extends SelectedTrackToggle {
  constructor(surface: McuSurface) {
    super(surface, Buttons.SOLO_BASE);
  }
}

@action({ UUID: "com.drewjohnston.logic-pro.track-arm" })
export class TrackArm extends SelectedTrackToggle {
  constructor(surface: McuSurface) {
    super(surface, Buttons.RECORD_ARM_BASE);
  }
}

/** Select the previous track (Logic's Up Arrow key command). */
@action({ UUID: "com.drewjohnston.logic-pro.track-prev" })
export class TrackPrev extends SingletonAction {
  override async onKeyDown(_ev: KeyDownEvent): Promise<void> {
    sendKeyToLogic(KeyCodes.ARROW_UP);
  }
}

/** Select the next track (Logic's Down Arrow key command). */
@action({ UUID: "com.drewjohnston.logic-pro.track-next" })
export class TrackNext extends SingletonAction {
  override async onKeyDown(_ev: KeyDownEvent): Promise<void> {
    sendKeyToLogic(KeyCodes.ARROW_DOWN);
  }
}
