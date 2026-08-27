import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

/**
 * Play/Stop toggle for Logic Pro.
 *
 * LSD-01 stub: proves the plugin pipeline by toggling its own state locally.
 * LSD-02/03 replace the local toggle with MCU transport messages, and state
 * becomes driven by Logic's LED feedback instead of an internal flag.
 */
@action({ UUID: "com.drewjohnston.logic-pro.transport-play" })
export class TransportPlay extends SingletonAction {
  override async onWillAppear(ev: WillAppearEvent): Promise<void> {
    if (ev.action.isKey()) {
      await ev.action.setState(0);
    }
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    streamDeck.logger.debug("Play/Stop pressed (stub)");
  }
}
