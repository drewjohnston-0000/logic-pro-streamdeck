---
id: LSD-06
title: Keystroke fallback action (any Logic key command)
status: todo
---

# LSD-06 - Keystroke fallback action

Logic has thousands of key commands MCU can't reach (Bounce, screensets, quantize presets…). One configurable action covers the long tail.

## Scope

- "Logic Key Command" action with a property inspector: pick modifiers + key.
- Delivery via CGEvent/osascript targeted at Logic Pro (activate if needed), not blind global keystrokes.
- Handle the macOS Accessibility permission prompt gracefully (detect, instruct the user).
- Curated preset list in the PI for common commands (Bounce Project, Toggle Musical Typing, screensets 1-9) so users don't have to know key codes.

## Done when

- A key bound to "Bounce Project…" opens Logic's bounce dialog even when Logic was backgrounded.
