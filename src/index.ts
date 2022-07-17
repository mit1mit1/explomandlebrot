import {
  addDurationObjects,
  BaseDuration,
  durationNames,
  instrument,
  Note,
  Pitch,
  pitchNames,
  ToneJSDuration,
} from "./utils/tonejs";
import * as Tone from "tone";

let allowAudio = false;
const calculatedNumbers = new Map();

const availableDurations: Array<BaseDuration> = [
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


const availablePitches: Array<Pitch> = [
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

const availableColorsMe = [
  "#03fcfc",
  "#03fc5e",
  "#20fc03",
  "#ea00ff",
  "#ff0062",
  "#ff6200",
  "#00ffbb",
  "#000473",
  "#910142",
  "#4d0187",
  "#feb5ff",
  "#fffbb5",
];
const availableColorsPinterest = [
  "#af43be",
  "#fd8090",
  "#c4ffff",
  "#08deea",
  "#1261d1",
];

const calculateMandlenumber = (
  xPosition: number,
  yPosition: number,
  prevResultX: number,
  prevResultY: number,
  iterations: number
): number => {
  let calculatedNumbersX = calculatedNumbers.get(xPosition);
  if (!calculatedNumbersX) {
    calculatedNumbersX = calculatedNumbers.set(xPosition, new Map());
  }
  const calculatedNumber = calculatedNumbersX.get(yPosition);
  if (calculatedNumber) {
    return calculatedNumber;
  }
  const nextResultX =
    xPosition + prevResultX * prevResultX - prevResultY * prevResultY;
  const nextResultY = yPosition + 2 * prevResultX * prevResultY;

  const magnitude = nextResultX * nextResultX + nextResultY * nextResultY;

  if (magnitude > 50) {
    calculatedNumbersX.set(yPosition, iterations);
    return iterations;
  } else if (iterations > 128) {
    calculatedNumbers.set(yPosition, -1);
    return -1;
  } else {
    return calculateMandlenumber(
      xPosition,
      yPosition,
      nextResultX,
      nextResultY,
      iterations + 1
    );
  }
};

const getColors = (
  xResolution: number,
  yResolution: number,
  xStepDistance: number,
  yStepDistance: number,
  centreX: number,
  centreY: number
) => {
  const colors: Array<Array<string>> = [];

  Tone.Transport.bpm.value = 120;
  Tone.Transport.position = "0:0:0";
  let currentTime: ToneJSDuration = { "16n": 0 };
  if (allowAudio) {
    Tone.start();
    Tone.Transport.cancel();
    instrument.releaseAll();
    instrument.sync();
  }
  for (let i = 0; i < xResolution; i++) {
    let xPosition = centreX + (i - 0.5 * xResolution) * xStepDistance;
    colors.push([]);
    for (let j = 0; j < yResolution; j++) {
      let yPosition = Math.abs(
        centreY + (j - 0.5 * yResolution) * yStepDistance
      );
      let mandleNumber = calculateMandlenumber(xPosition, yPosition, 0, 0, 0);
      if (allowAudio && i % 73 === 0 && j % 48 === 0) {
        let mandleNote: Note = {
          pitch: availablePitches[Math.abs(mandleNumber) % availablePitches.length],
          durations: [
            availableDurations[Math.abs(mandleNumber) % availableDurations.length],
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
        currentTime = addDurationObjects(currentTime, mandleNote.durations);
      }
      if (mandleNumber == -1) {
        colors[i].push("black");
      } else {
        colors[i].push(
          availableColorsPinterest[
            mandleNumber % availableColorsPinterest.length
          ]
        );
      }
    }
  }
  console.log("finished calculating colors");
  return colors;
};

let xResolution = 648;
let yResolution = 400;
let centreX = -2.001;
let centreY = 0;
let xStepDistance = 0.001;
let yStepDistance = 0.001;
let colors = getColors(
  xResolution,
  yResolution,
  xStepDistance,
  yStepDistance,
  centreX,
  centreY
);
let prevColors = colors.map((colorArray) => colorArray.map(() => "#000"));
const recalculateColors = () => {
  colors = getColors(
    xResolution,
    yResolution,
    xStepDistance,
    yStepDistance,
    centreX,
    centreY
  );
  var canvas = document.getElementById("mandlerrain-canvas") as any;
  var gl = canvas?.getContext("2d", { alpha: false });
  // var gl = canvas?.getContext("webgl");
  // if (gl === null) {
  //   alert(
  //     "Unable to initialize WebGL. Your browser or machine may not support it."
  //   );
  //   return;
  // }

  // // Set clear color to black, fully opaque
  // gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // // Clear the color buffer with specified clear color
  // gl.clear(gl.COLOR_BUFFER_BIT);
  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < colors[i].length; j++) {
      if (prevColors[i][j] !== colors[i][j]) {
        gl.fillStyle = colors[i][j];
        gl.fillRect(i, j, 1, 1);
        prevColors[i][j] = colors[i][j];
      }
    }
  }
};

const goUp = () => {
  centreY = centreY - yStepDistance * 32;
  recalculateColors();
};

const goDown = () => {
  centreY = centreY + yStepDistance * 32;
  recalculateColors();
};

const goLeft = () => {
  centreX = centreX - xStepDistance * 32;
  recalculateColors();
};

const goRight = () => {
  centreX = centreX + xStepDistance * 32;
  recalculateColors();
};

const zoomOut = () => {
  xStepDistance = xStepDistance * 2;
  yStepDistance = yStepDistance * 2;
  recalculateColors();
};
const zoomIn = () => {
  xStepDistance = xStepDistance * 0.5;
  yStepDistance = yStepDistance * 0.5;
  recalculateColors();
};

const handleKeypress = (event: any) => {
  if (event.key === "w") {
    goUp();
  }
  if (event.key === "a") {
    goLeft();
  }
  if (event.key === "s") {
    goDown();
  }
  if (event.key === "d") {
    goRight();
  }
  if (event.key === "q") {
    zoomIn();
  }
  if (event.key === "e") {
    zoomOut();
  }
  if (allowAudio) {
    Tone.start();
    instrument.sync();
    Tone.Transport.start();
  } else {
    allowAudio = true;
  }
};

document
  .querySelector("#explomandlebrotbox")
  ?.addEventListener("keypress", handleKeypress);
