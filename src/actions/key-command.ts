import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";

import { sendCharToLogic, type Modifier } from "../keystrokes";

type KeyCommandSettings = {
  key?: string;
  command?: boolean;
  option?: boolean;
  control?: boolean;
  shift?: boolean;
};

/**
 * Sends a user-configured key command to Logic Pro — the escape hatch for the
 * thousands of Logic commands MCU cannot reach. Key and modifiers are chosen
 * in the property inspector.
 */
@action({ UUID: "com.drewjohnston.logic-pro.key-command" })
export class KeyCommand extends SingletonAction<KeyCommandSettings> {
  override async onKeyDown(ev: KeyDownEvent<KeyCommandSettings>): Promise<void> {
    const { key, ...mods } = ev.payload.settings;
    if (!key) {
      await ev.action.showAlert();
      return;
    }
    const modifiers = (["command", "option", "control", "shift"] as Modifier[]).filter((m) => mods[m]);
    sendCharToLogic(key, modifiers);
  }
}
