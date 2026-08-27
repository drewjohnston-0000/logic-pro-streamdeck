# One-time Logic Pro setup

The plugin exposes a virtual MIDI control surface named **SD Logic Control**. Logic has to be told once to treat it as a Mackie Control; after that the connection is automatic on every launch.

1. Make sure the Stream Deck app is running (it hosts the plugin, which creates the MIDI port).
2. In Logic Pro, enable advanced control surface options if you haven't:
   **Logic Pro → Settings → Advanced** — ensure full advanced tools are on.
3. Open **Logic Pro → Control Surfaces → Setup…**
4. In the Setup window: **New → Install…**, select **Mackie Designs – Mackie Control** (model *Mackie Control*), click **Add**.
5. Select the new Mackie Control device and set both ports:
   - **Input Port:** `SD Logic Control`
   - **Output Port:** `SD Logic Control`
6. Close the window. The Stream Deck play key should now track Logic's transport — press play in Logic with the spacebar and watch the key light up.

## Troubleshooting

- **No `SD Logic Control` port listed:** the plugin isn't running — check the Stream Deck app is open and the plugin appears in it, then reopen the Setup window.
- **Buttons work but keys never light up:** Input/Output ports are swapped or the Output Port is unset — Logic must *send* to `SD Logic Control` for feedback.
- **Logic auto-detected something on its own:** delete any duplicate/auto-created surface in Control Surfaces Setup; one Mackie Control entry pointing at `SD Logic Control` is all you need.
- **Faders/plugins jump unexpectedly:** another device may also be speaking MCU (e.g. a controller's "MCU/HUI" port). Keep only the surfaces you actually use in the Setup window.
