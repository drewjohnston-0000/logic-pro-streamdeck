---
id: LSD-03
title: Transport actions with live feedback
status: done
---

# LSD-03 - Transport actions with live feedback

First user-facing win: a transport row that shows real state.

## Scope

Actions (each a manifest action with its own icon states):

- Play/Stop (toggle, lit while playing)
- Record (lit while recording)
- Cycle/Loop (lit when cycle on)
- Metronome/Click (lit when click on)
- Return to Zero
- Rewind / Fast-forward (press-and-hold scrub)

All driven by the LSD-02 MCU layer: key press sends the MCU button, LED feedback from Logic sets the key state — no state guessed locally.

## Done when

- Hitting play in Logic itself (mouse/spacebar) lights the Stream Deck key, proving feedback is real.
