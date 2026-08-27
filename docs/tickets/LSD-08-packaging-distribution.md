---
id: LSD-08
title: Packaging & free distribution
status: todo
---

# LSD-08 - Packaging & free distribution

Goal: anyone (including regions the marketplace blocks) can install this for free.

## Scope

- `streamdeck pack` producing a `.streamDeckPlugin` double-click installer.
- GitHub Actions release workflow: tag → build → attach installer to a GitHub Release.
- README install instructions that don't assume marketplace access.
- Evaluate a free Elgato Marketplace listing as a second channel (submission requirements: validated manifest, icon specs, review process).

## Done when

- A release tag produces a downloadable installer that works on a clean machine.
