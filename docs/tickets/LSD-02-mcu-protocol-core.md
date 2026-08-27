---
id: LSD-02
title: Virtual MIDI port & MCU protocol core
status: done
---

# LSD-02 - Virtual MIDI port & MCU protocol core

The heart of the plugin: emulate a Mackie Control Universal surface that Logic Pro connects to, giving us bidirectional control and state.

## Scope

- Create a virtual CoreMIDI input+output port pair (via `@julusian/midi`), named so Logic auto-detects it (e.g. "SD Logic Control").
- MCU message layer:
  - Outbound: note-on button presses (transport, bank/channel, function keys), pitch-bend faders.
  - Inbound: LED state (note-on velocity 0/127) for play/record/cycle/solo/mute/arm, 7-segment timecode display, LCD text (sysex) carrying track names.
- Connection lifecycle: surface comes up when the plugin starts, survives Logic restarts, exposes a typed event emitter (`transportChanged`, `trackNameChanged`, `ledChanged`) the actions subscribe to.
- Doc: `docs/logic-setup.md` — one-time Logic setup (Control Surfaces > Setup > New > Mackie Control, pick our virtual port).

## Notes

- MCU reference: note numbers 0x5E play, 0x5D stop, 0x5F record, 0x56 cycle; LCD sysex header `F0 00 00 66 14 12`.
- Logic sends LED feedback only after the surface is registered in Control Surfaces Setup — the setup doc is part of "done".

## Done when

- With Logic running, pressing a test key toggles playback AND Logic's transport state is reflected back into plugin logs/events.
