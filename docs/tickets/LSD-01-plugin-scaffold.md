---
id: LSD-01
title: Plugin scaffold & build tooling
status: done
---

# LSD-01 - Plugin scaffold & build tooling

Stand up a buildable Stream Deck plugin skeleton targeting the Node.js plugin runtime.

## Scope

- TypeScript source in `src/`, bundled with rollup into `com.drewjohnston.logic-pro.sdPlugin/bin/plugin.js`.
- `manifest.json` for the `com.drewjohnston.logic-pro` plugin: macOS only, Node runtime, placeholder icons.
- One stub action registered end-to-end (appears in the Stream Deck app, logs on key press) to prove the pipeline.
- `@elgato/cli` as a dev dependency for `streamdeck link` / `streamdeck restart` during development.
- README with dev-loop instructions.

## Done when

- `npm run build` succeeds.
- `streamdeck link` + restart shows the plugin in the Stream Deck app and the stub action responds to a key press.
