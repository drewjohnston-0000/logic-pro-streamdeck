# Tickets

Local ticket system for the Logic Pro Stream Deck plugin. No Jira — tickets live here.

- IDs are `LSD-##` (Logic Stream Deck), zero-padded, minted sequentially by adding a file here.
- One file per ticket: `LSD-01-short-slug.md`.
- The ticket ID doubles as the git branch name (`lsd-01`, or `lsd-01-scaffold` if disambiguation is needed).
- PR titles: `LSD-01 - Title`.
- Status lives in the ticket frontmatter: `todo | in-progress | done`.

## Index

| ID | Title | Status |
|----|-------|--------|
| LSD-01 | Plugin scaffold & build tooling | done |
| LSD-02 | Virtual MIDI port & MCU protocol core | done |
| LSD-03 | Transport actions with live feedback | todo |
| LSD-04 | Selected-track strip (mute/solo/arm, name) | todo |
| LSD-05 | Markers & navigation | todo |
| LSD-06 | Keystroke fallback action (any Logic key command) | todo |
| LSD-07 | Icons, key art & 15-key profile layout | todo |
| LSD-08 | Packaging & free distribution | todo |

Keep this index in sync when tickets change status.
