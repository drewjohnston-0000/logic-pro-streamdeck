/**
 * Mackie Control Universal (Logic Control) protocol constants.
 *
 * Buttons are note-on messages on MIDI channel 1: velocity 127 = press,
 * 0 = release. Logic echoes LED state back on the same note numbers.
 */
export const Buttons = {
  // Per-channel strips (add channel index 0-7)
  RECORD_ARM_BASE: 0x00,
  SOLO_BASE: 0x08,
  MUTE_BASE: 0x10,
  SELECT_BASE: 0x18,

  // Fader bank navigation
  BANK_LEFT: 0x2e,
  BANK_RIGHT: 0x2f,
  CHANNEL_LEFT: 0x30,
  CHANNEL_RIGHT: 0x31,

  // Function row
  MARKER: 0x54,
  NUDGE: 0x55,
  CYCLE: 0x56,
  DROP: 0x57,
  REPLACE: 0x58,
  CLICK: 0x59,
  SOLO_GLOBAL: 0x5a,

  // Transport
  REWIND: 0x5b,
  FAST_FORWARD: 0x5c,
  STOP: 0x5d,
  PLAY: 0x5e,
  RECORD: 0x5f,

  // Cursor / zoom / scrub
  CURSOR_UP: 0x60,
  CURSOR_DOWN: 0x61,
  CURSOR_LEFT: 0x62,
  CURSOR_RIGHT: 0x63,
  ZOOM: 0x64,
  SCRUB: 0x65
} as const;

export type McuButton = (typeof Buttons)[keyof typeof Buttons];

/** Sysex header shared by all Mackie Control messages: Mackie manufacturer id + MCU device id. */
export const SYSEX_HEADER = [0xf0, 0x00, 0x00, 0x66, 0x14] as const;

/** Sysex command bytes following the header. */
export const Sysex = {
  DEVICE_QUERY: 0x00,
  HOST_CONNECTION_QUERY: 0x01,
  HOST_CONNECTION_REPLY: 0x02,
  HOST_CONNECTION_CONFIRMATION: 0x03,
  LCD_WRITE: 0x12
} as const;

/** The main LCD is 2 rows × 56 columns, addressed as offsets 0-111. */
export const LCD_COLUMNS = 56;
export const LCD_ROWS = 2;
