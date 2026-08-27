import streamDeck from "@elgato/streamdeck";
import { execFile } from "node:child_process";

/**
 * Sends a key command to Logic Pro via AppleScript, activating Logic first so
 * the keystroke lands in the right app. Requires the Stream Deck app to have
 * macOS Accessibility permission (System Settings > Privacy & Security >
 * Accessibility) — the first use prompts for it.
 */
export function sendKeyToLogic(key: string, modifiers: Array<"command" | "option" | "control" | "shift"> = []): void {
  const using = modifiers.length ? ` using {${modifiers.map((m) => `${m} down`).join(", ")}}` : "";
  const script = [
    'tell application "Logic Pro" to activate',
    `tell application "System Events" to keystroke "${key}"${using}`
  ].join("\n");

  execFile("/usr/bin/osascript", ["-e", script], (error, _stdout, stderr) => {
    if (error) {
      streamDeck.logger.error(`osascript keystroke "${key}" failed: ${stderr || error.message}`);
    }
  });
}
