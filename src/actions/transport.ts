import streamDeck, { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";

import { Buttons } from "../mcu/constants";
import type { McuSurface } from "../mcu/surface";
import { McuHoldAction, McuLedAction } from "./mcu-led-action";

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

@action({ UUID: "com.drewjohnston.logic-pro.transport-rewind" })
export class TransportRewind extends McuHoldAction {
  constructor(surface: McuSurface) {
    super(surface, Buttons.REWIND);
  }
}

@action({ UUID: "com.drewjohnston.logic-pro.transport-forward" })
export class TransportForward extends McuHoldAction {
  constructor(surface: McuSurface) {
    super(surface, Buttons.FAST_FORWARD);
  }
}

/**
 * Return to zero. MCU has no dedicated RTZ button; Logic's transport jumps to
 * the project start when Stop is pressed while already stopped, so a double
 * Stop tap covers both cases (playing -> stop + jump, stopped -> jump).
 */
@action({ UUID: "com.drewjohnston.logic-pro.transport-rtz" })
export class TransportReturnToZero extends SingletonAction {
  constructor(private readonly surface: McuSurface) {
    super();
  }

  override async onKeyDown(_ev: KeyDownEvent): Promise<void> {
    this.surface.tap(Buttons.STOP);
    this.surface.tap(Buttons.STOP);
    streamDeck.logger.debug("Return to zero (double stop)");
  }
}
