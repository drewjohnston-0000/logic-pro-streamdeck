import streamDeck, { LogLevel } from "@elgato/streamdeck";

import {
  TransportClick,
  TransportCycle,
  TransportForward,
  TransportPlay,
  TransportRecord,
  TransportReturnToZero,
  TransportRewind
} from "./actions/transport";
import { TrackArm, TrackMute, TrackName, TrackNext, TrackPrev, TrackSolo } from "./actions/track";
import { McuSurface } from "./mcu/surface";

streamDeck.logger.setLevel(LogLevel.DEBUG);

const surface = new McuSurface();
surface.on("started", () => streamDeck.logger.info(`MCU surface up as virtual MIDI port "${McuSurface.PORT_NAME}"`));
surface.on("error", (err) => streamDeck.logger.error("MCU surface error", err));
surface.on("led", (note, on) => streamDeck.logger.debug(`LED ${note.toString(16)} ${on ? "on" : "off"}`));
surface.on("lcd", (row, text) => streamDeck.logger.debug(`LCD[${row}] "${text}"`));

streamDeck.actions.registerAction(new TransportPlay(surface));
streamDeck.actions.registerAction(new TransportRecord(surface));
streamDeck.actions.registerAction(new TransportCycle(surface));
streamDeck.actions.registerAction(new TransportClick(surface));
streamDeck.actions.registerAction(new TransportRewind());
streamDeck.actions.registerAction(new TransportForward());
streamDeck.actions.registerAction(new TransportReturnToZero(surface));
streamDeck.actions.registerAction(new TrackMute(surface));
streamDeck.actions.registerAction(new TrackSolo(surface));
streamDeck.actions.registerAction(new TrackArm(surface));
streamDeck.actions.registerAction(new TrackName(surface));
streamDeck.actions.registerAction(new TrackPrev());
streamDeck.actions.registerAction(new TrackNext());

streamDeck.connect();
surface.start();
