# Logic Pro for Stream Deck

A Stream Deck plugin for Apple Logic Pro with **real state feedback** — not a keystroke macro board. The plugin emulates a Mackie Control surface over a virtual MIDI port, so keys light up with Logic's actual transport, track and cycle state.

**Status: early development.** See [docs/tickets](docs/tickets/README.md) for the roadmap.

## Planned features (15-key layout)

- **Transport** — play/stop, record, cycle, click, return-to-zero, with live LEDs (LSD-03)
- **Track strip** — mute / solo / record-arm of the selected track, track name on the key (LSD-04)
- **Markers & navigation** — drop marker, prev/next marker, punch points (LSD-05)
- **Any key command** — configurable fallback for the rest of Logic's command set (LSD-06)

## Development

Requires Node.js 20+ and the Stream Deck app (6.5+) on macOS.

```sh
npm install
npm run build                                        # bundles src/ into the .sdPlugin
npx streamdeck link com.drewjohnston.logic-pro.sdPlugin   # once: register dev plugin
npx streamdeck restart com.drewjohnston.logic-pro         # reload after a build
npm run watch                                        # rebuild + restart on change
```

> **Manifest wrinkle:** `streamdeck restart` hot-reloads plugin *code* only. Any change to
> `manifest.json` (new actions, icons, states) requires fully quitting and relaunching the
> Stream Deck app — and closing its window is not quitting; it keeps running in the menu bar.
> Bounce it with: `pkill -f "Elgato Stream Deck"; sleep 3; open -a "Elgato Stream Deck"`
>
> **Reload wrinkle:** `streamdeck restart` can also silently no-op (reports success, same PID).
> The reliable code reload is killing the plugin process — the app respawns it in seconds:
> `pkill -f "logic-pro.sdPlugin/bin/plugin.js"`. Verify with a fresh "MCU surface up" log line.

Project layout:

- `src/` — TypeScript plugin source (bundled by rollup)
- `com.drewjohnston.logic-pro.sdPlugin/` — the plugin package: manifest, images, built `bin/plugin.js`
- `docs/tickets/` — local `LSD-##` ticket system; ticket IDs double as branch names

## Why not the marketplace plugins?

They're region-locked for some of us. This one is free, open source, and will ship as a downloadable `.streamDeckPlugin` installer (LSD-08).
