import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { TransportPlay } from "./actions/transport-play";
import { McuSurface } from "./mcu/surface";

streamDeck.logger.setLevel(LogLevel.DEBUG);

const surface = new McuSurface();
surface.on("started", () => streamDeck.logger.info(`MCU surface up as virtual MIDI port "${McuSurface.PORT_NAME}"`));
surface.on("error", (err) => streamDeck.logger.error("MCU surface error", err));
surface.on("led", (note, on) => streamDeck.logger.debug(`LED ${note.toString(16)} ${on ? "on" : "off"}`));
surface.on("lcd", (row, text) => streamDeck.logger.debug(`LCD[${row}] "${text}"`));

streamDeck.actions.registerAction(new TransportPlay(surface));

streamDeck.connect();
surface.start();
