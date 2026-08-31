import streamDeck from "@elgato/streamdeck";
import { execFile } from "node:child_process";

/** macOS virtual key codes for keys used as Logic key commands. */
export const KeyCodes = {
  COMMA: 43,
  PERIOD: 47,
  ARROW_UP: 126,
  ARROW_DOWN: 125
} as const;

export type Modifier = "command" | "option" | "control" | "shift";

/** Named non-character keys usable in the Key Command action. */
const NAMED_KEYS: Record<string, number> = {
  return: 36, enter: 36, tab: 48, space: 49, delete: 51, escape: 53, esc: 53,
  left: 123, right: 124, down: 125, up: 126,
  f1: 122, f2: 120, f3: 99, f4: 118, f5: 96, f6: 97, f7: 98, f8: 100,
  f9: 101, f10: 109, f11: 103, f12: 111
};

/**
 * Sends an arbitrary key command to Logic Pro: a single character (sent as a
 * layout-aware keystroke) or a named special key (sent as a key code).
 */
export function sendCharToLogic(key: string, modifiers: Modifier[] = []): void {
  const named = NAMED_KEYS[key.toLowerCase()];
  if (named !== undefined) {
    sendKeyToLogic(named, modifiers);
    return;
  }
  const char = key.charAt(0).toLowerCase().replace(/(["\\])/g, "\\$1");
  const using = modifiers.length ? ` using {${modifiers.map((m) => `${m} down`).join(", ")}}` : "";
  runOsascript([
    'tell application "Logic Pro" to activate',
    `tell application "System Events" to keystroke "${char}"${using}`
  ]);
}

/**
 * Sends a key command to Logic Pro via AppleScript, activating Logic first so
 * the keystroke lands in the right app. Uses raw key codes (layout-agnostic)
 * rather than character keystrokes. Requires the Stream Deck app to have
 * macOS Accessibility permission (System Settings > Privacy & Security >
 * Accessibility) — the first use prompts for it.
 */
export function sendKeyToLogic(keyCode: number, modifiers: Modifier[] = []): void {
  const using = modifiers.length ? ` using {${modifiers.map((m) => `${m} down`).join(", ")}}` : "";
  runOsascript([
    'tell application "Logic Pro" to activate',
    `tell application "System Events" to key code ${keyCode}${using}`
  ]);
}

function runOsascript(lines: string[]): void {
  const script = lines.join("\n");
  execFile("/usr/bin/osascript", ["-e", script], (error, _stdout, stderr) => {
    if (error) {
      streamDeck.logger.error(`osascript failed: ${stderr || error.message}`);
    } else {
      streamDeck.logger.debug(`osascript ok: ${lines[lines.length - 1]}`);
    }
  });
}
