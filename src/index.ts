import * as Tone from "tone";
import PianoMp3 from "tonejs-instrument-piano-mp3";
import { instrumentVolume } from "./constants";
import { slide } from "./utils/characterMovement";
import { centreViewportOnCharacter, zoomIn, zoomOut } from "./utils/viewport";

export let allowAudio = false;

export const instrument = new PianoMp3({
  minify: true,
}).toDestination("main");
instrument.volume.value = instrumentVolume;

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
  if (event.key === "q") {
    zoomIn();
  }
  if (event.key === "e") {
    zoomOut();
  }
  if (event.key === "f") {
    centreViewportOnCharacter();
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
