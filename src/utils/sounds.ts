import {
  addDurationObjects,
  BaseDuration,
  instrument,
  Note,
  Pitch,
  ToneJSDuration,
} from "./tonejs";
import * as Tone from "tone";
import { getXPosition, getYPosition } from "./grid";
import { xResolution, yResolution } from "../constants";
import { calculateMandlenumber } from "./math";

const quarterDurations: Array<BaseDuration> = [
  "16n",
  // "8n",
  "8n.",
  "4n",
  "4n.",
  "2n",
  "2n.",
  "1n",
  "1n.",
  // "16t",
  // "8t",
  // "4t",
  // "2t",
];

const tritoneScale: Array<Pitch> = [
  "A3",
  // "A#3",
  // "B3",
  "C4",
  // "C#4",
  // "D4",
  "D#4",
  // "E4",
  // "F4",
  "F#4",
  // "G4",
  // "G#4",
  "A4",
  // "A#4",
  // "B4",
  "C5",
  // "C#5",
  // "D5",
  "D#5",
  // "E5",
  // "F5",
  "F#5",
  // "G5",
  // "G#5",
  "A5",
  // "A#5",
  // "B5",
];

const pentatonicScale: Array<Pitch> = [
  // "A3",
  "A#3",
  // "B3",
  // "C4",
  "C#4",
  // "D4",
  "D#4",
  // "E4",
  // "F4",
  "F#4",
  // "G4",
  "G#4",
  // "A4",
  "A#4",
  // "B4",
  // "C5",
  "C#5",
  // "D5",
  "D#5",
  // "E5",
  // "F5",
  "F#5",
  // "G5",
  "G#5",
  // "A5",
  "A#5",
  // "B5",
];


const pushNote = (
  mandleNumber: number,
  currentTime: ToneJSDuration,
  allowAudio: boolean
) => {
  if (allowAudio) {
    let mandleNote: Note = {
      pitch: pentatonicScale[Math.abs(mandleNumber) % pentatonicScale.length],
      durations: [
        quarterDurations[Math.abs(mandleNumber) % quarterDurations.length],
      ],
    };
    if (!mandleNote.rest) {
      let holdNoteLength: ToneJSDuration | string = addDurationObjects(
        {},
        mandleNote.durations
      );
      if (mandleNote.staccato) {
        if (
          mandleNote.durations.length === 1 &&
          (mandleNote.durations[0] === "16n" ||
            mandleNote.durations[0] === "8n")
        ) {
          holdNoteLength = "32n";
        } else {
          holdNoteLength = "16n";
        }
      }
      let attackDuration = holdNoteLength;
      instrument.triggerAttackRelease(
        mandleNote.pitch,
        attackDuration,
        currentTime
      );
    }
  }
};

export const getSounds = async (
  xStepDistance: number,
  centreX: number,
  yStepDistance: number,
  centreY: number,
  allowAudio: boolean
) => {
  Tone.Transport.bpm.value = 120;
  Tone.Transport.position = "0:0:0";
  let sinceDifferentNumberOscillater = 1;
  let sinceDifferentNumberTraverser = 1;
  let prevMandleNumberOscillater = -2;
  let prevMandleNumberTraverser = -2;
  let currentTimeOscillater: ToneJSDuration = { "8n": 0 };
  let currentTimeTraverser: ToneJSDuration = { "16n": 0 };
  let xCentre = Math.floor(xResolution / 2);
  if (allowAudio) {
    Tone.start();
    instrument.releaseAll();
    Tone.Transport.cancel();
    instrument.sync();
    let yCentre = Math.floor(yResolution / 2);
    for (let i = 3; i < xResolution * yResolution; i++) {
      let xSquareOscillater = xCentre + Math.floor(i / 5) * (-1) ** i;
      let ySquareOscillater =
        yCentre + Math.floor(i / 3) * (-1) ** Math.floor(i / 3);
      let xPositionOscillater = getXPosition(
        xSquareOscillater,
        xStepDistance,
        centreX
      );
      let yPositionOscillater = getYPosition(
        ySquareOscillater,
        yStepDistance,
        centreY
      );

      let mandleNumberOscillater = calculateMandlenumber(
        xPositionOscillater,
        yPositionOscillater,
        0,
        0,
        0
      );
      if (mandleNumberOscillater != prevMandleNumberOscillater) {
        pushNote(mandleNumberOscillater, currentTimeOscillater, allowAudio);
        currentTimeOscillater["8n"] =
          (currentTimeOscillater["8n"] ?? 0) + sinceDifferentNumberOscillater;
        sinceDifferentNumberOscillater = 1;
        prevMandleNumberOscillater = mandleNumberOscillater;
      } else {
        sinceDifferentNumberOscillater++;
      }

      let xSquareTraverser = (xCentre + i) % xResolution;
      let ySquareTraverser =
        yCentre + (Math.floor(i / yResolution) % yResolution);
      let xPositionTraverser = getXPosition(
        xSquareTraverser,
        xStepDistance,
        centreX
      );
      let yPositionTraverser = getYPosition(
        ySquareTraverser,
        yStepDistance,
        centreY
      );

      let mandleNumberTraverser = calculateMandlenumber(
        xPositionTraverser,
        yPositionTraverser,
        0,
        0,
        0
      );
      if (mandleNumberTraverser != prevMandleNumberTraverser) {
        pushNote(mandleNumberTraverser, currentTimeTraverser, allowAudio);
        currentTimeTraverser["16n"] =
          (currentTimeTraverser["16n"] ?? 0) + sinceDifferentNumberTraverser;
        sinceDifferentNumberTraverser = 1;
        prevMandleNumberTraverser = mandleNumberTraverser;
      } else {
        sinceDifferentNumberTraverser++;
      }
    }
    new Tone.Loop(() => {
      getSounds(
        xStepDistance / 2,
        centreX,
        yStepDistance / 2,
        centreY,
        allowAudio
      );
    }, currentTimeTraverser).start(currentTimeTraverser);
    Tone.Transport.start();
  }
};
