import streamDeck from "@elgato/streamdeck";
import { execFile } from "node:child_process";

/** macOS virtual key codes for keys used as Logic key commands. */
export const KeyCodes = {
  COMMA: 43,
  PERIOD: 47,
  ARROW_UP: 126,
  ARROW_DOWN: 125
} as const;

/**
 * Sends a key command to Logic Pro via AppleScript, activating Logic first so
 * the keystroke lands in the right app. Uses raw key codes (layout-agnostic)
 * rather than character keystrokes. Requires the Stream Deck app to have
 * macOS Accessibility permission (System Settings > Privacy & Security >
 * Accessibility) — the first use prompts for it.
 */
export function sendKeyToLogic(keyCode: number, modifiers: Array<"command" | "option" | "control" | "shift"> = []): void {
  const using = modifiers.length ? ` using {${modifiers.map((m) => `${m} down`).join(", ")}}` : "";
  const script = [
    'tell application "Logic Pro" to activate',
    `tell application "System Events" to key code ${keyCode}${using}`
  ].join("\n");

  execFile("/usr/bin/osascript", ["-e", script], (error, _stdout, stderr) => {
    if (error) {
      streamDeck.logger.error(`osascript key code ${keyCode} failed: ${stderr || error.message}`);
    } else {
      streamDeck.logger.debug(`sent key code ${keyCode} to Logic`);
    }
  });
}
