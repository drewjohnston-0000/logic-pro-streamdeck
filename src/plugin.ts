import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { TransportPlay } from "./actions/transport-play";

streamDeck.logger.setLevel(LogLevel.DEBUG);

streamDeck.actions.registerAction(new TransportPlay());

streamDeck.connect();
