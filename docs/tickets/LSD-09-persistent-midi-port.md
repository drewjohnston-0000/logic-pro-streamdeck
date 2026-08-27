---
id: LSD-09
title: Persistent MIDI port (survive plugin reloads)
status: todo
---

# LSD-09 - Persistent MIDI port

Every plugin reload destroys and recreates the "SD Logic Control" virtual port with a new CoreMIDI unique ID. Logic binds surfaces by unique ID, so reloads can silently break the binding — worst case, transport presses fall through to instrument tracks as notes. Ghost entries accumulate in Logic's port dropdowns and survive even a Logic restart.

This bites the dev loop constantly and will bite end users on every plugin update.

## Scope

- Move virtual port ownership into a tiny helper process the plugin spawns and manages (launchd agent or plain child that detaches). The helper holds the CoreMIDI port; the plugin connects to the helper (unix socket or stdio) and relays MCU bytes.
- Helper lifecycle: started on demand, survives plugin restarts, idles harmlessly when the plugin is down, single-instance guard.
- Clean uninstall story (helper exits when the plugin is uninstalled).

## Notes

- Investigate first whether CoreMIDI allows pinning a stable unique ID (`kMIDIPropertyUniqueID` can be set on virtual endpoints before publishing) — if Logic rebinds by unique ID and we can keep the ID constant across restarts, a helper process may be unnecessary. Try this cheap path before building the helper.

## Done when

- Kill/restart the plugin process and the Stream Deck app repeatedly: Logic's Mackie Control binding keeps working with no re-pick, no ghost entries accumulate.
