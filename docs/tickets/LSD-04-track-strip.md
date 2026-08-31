---
id: LSD-04
title: Selected-track strip (mute/solo/arm, name)
status: done
---

# LSD-04 - Selected-track strip

Control the selected track from the deck and see which track that is.

## Scope

- Mute, Solo, Record-arm actions for the currently selected channel, lit from MCU LED feedback.
- Track name action/label: parse MCU LCD sysex to show the selected track's name on a key.
- Next/Previous track actions (MCU channel left/right on the selected fader bank).

## Notes

- MCU is bank-of-8 oriented; "selected track" needs the MCU SELECT model — follow Logic's behavior where the selected track follows channel SELECT presses. Verify how Logic maps selection before committing to a design.

## Done when

- Selecting a track in Logic updates the name key; mute/solo/arm keys control that track and mirror its state.
