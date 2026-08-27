import streamDeck, { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";

import { Buttons } from "../mcu/constants";
import type { McuSurface } from "../mcu/surface";
import { sendKeyToLogic } from "../keystrokes";
import { McuLedAction } from "./mcu-led-action";

/**
 * Play/Stop toggle. MCU PLAY does not toggle — pressed while playing it
 * restarts playback — so use the PLAY LED to decide which button to send.
 */
@action({ UUID: "com.drewjohnston.logic-pro.transport-play" })
export class TransportPlay extends McuLedAction {
  constructor(surface: McuSurface) {
    super(surface, Buttons.PLAY);
  }

  override async onKeyDown(_ev: KeyDownEvent): Promise<void> {
    this.surface.tap(this.surface.ledState(Buttons.PLAY) ? Buttons.STOP : Buttons.PLAY);
  }
}

/**
 * Record toggle. MCU RECORD is ignored by Logic while already recording, so
 * when the RECORD LED is lit a press sends STOP instead.
 */
@action({ UUID: "com.drewjohnston.logic-pro.transport-record" })
export class TransportRecord extends McuLedAction {
  constructor(surface: McuSurface) {
    super(surface, Buttons.RECORD);
  }

  override async onKeyDown(_ev: KeyDownEvent): Promise<void> {
    this.surface.tap(this.surface.ledState(Buttons.RECORD) ? Buttons.STOP : Buttons.RECORD);
  }
}

@action({ UUID: "com.drewjohnston.logic-pro.transport-cycle" })
export class TransportCycle extends McuLedAction {
  constructor(surface: McuSurface) {
    super(surface, Buttons.CYCLE);
  }
}

@action({ UUID: "com.drewjohnston.logic-pro.transport-click" })
export class TransportClick extends McuLedAction {
  constructor(surface: McuSurface) {
    super(surface, Buttons.CLICK);
  }
}

/**
 * Bar navigation uses Logic's own Rewind/Forward key commands ("," / ".")
 * rather than MCU: the MCU shuttle steps by division (1/16), latches, and
 * fights running playback, while the key commands hop exactly one bar and
 * behave during playback.
 */
@action({ UUID: "com.drewjohnston.logic-pro.transport-rewind" })
export class TransportRewind extends SingletonAction {
  override async onKeyDown(_ev: KeyDownEvent): Promise<void> {
    sendKeyToLogic(",");
  }
}

@action({ UUID: "com.drewjohnston.logic-pro.transport-forward" })
export class TransportForward extends SingletonAction {
  override async onKeyDown(_ev: KeyDownEvent): Promise<void> {
    sendKeyToLogic(".");
  }
}

/**
 * Return to zero. MCU has no dedicated RTZ button. While playing, PLAY
 * restarts from the project start without stopping; while stopped, a double
 * Stop tap jumps the playhead to the start.
 */
@action({ UUID: "com.drewjohnston.logic-pro.transport-rtz" })
export class TransportReturnToZero extends SingletonAction {
  constructor(private readonly surface: McuSurface) {
    super();
  }

  override async onKeyDown(_ev: KeyDownEvent): Promise<void> {
    if (this.surface.ledState(Buttons.PLAY)) {
      this.surface.tap(Buttons.PLAY);
      streamDeck.logger.debug("Return to zero (restart playback)");
    } else {
      this.surface.tap(Buttons.STOP);
      this.surface.tap(Buttons.STOP);
      streamDeck.logger.debug("Return to zero (double stop)");
    }
  }
}
