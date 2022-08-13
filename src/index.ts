import * as Tone from "tone";
import PianoMp3 from "tonejs-instrument-piano-mp3";
import { slide } from "./utils/characterMovement";

export let allowAudio = false;

export const instrument = new PianoMp3({
  minify: true,
}).toDestination("main");
instrument.volume.value = -24;

const handleKeypress = (event: any) => {
  if (event.key === "w") {
    slide("up", 0);
  }
  if (event.key === "a") {
    slide("left", 0);
  }
  if (event.key === "s") {
    slide("down", 0);
  }
  if (event.key === "d") {
    slide("right", 0);
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
