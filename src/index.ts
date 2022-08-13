import * as Tone from "tone";
import { getColors } from "./utils/colors";
import {
  initialXStepDistance,
  initialYStepDistance,
  rectSideLengthX,
  rectSideLengthY,
} from "./constants";
import { getSounds } from "./utils/sounds";
import PianoMp3 from "tonejs-instrument-piano-mp3";
import { viewportCentre, gridDistance } from "./state";
import {
  characterDown,
  characterLeft,
  characterRight,
  characterUp,
} from "./utils/characterMovement";

export let allowAudio = false;

export const instrument = new PianoMp3({
  minify: true,
}).toDestination("main");
instrument.volume.value = -24;

const handleKeypress = (event: any) => {
  if (event.key === "w") {
    characterUp();
  }
  if (event.key === "a") {
    characterLeft();
  }
  if (event.key === "s") {
    characterDown();
  }
  if (event.key === "d") {
    characterRight();
  }
  if (allowAudio) {
    Tone.start();
    Tone.Transport.start();
  } else {
    allowAudio = true;
  }
};

document
  .querySelector("#explomandlebrotbox")
  ?.addEventListener("keypress", handleKeypress);
