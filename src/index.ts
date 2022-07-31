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
instrument.volume.value = -24;

const MAX_ITERATIONS = 128;

let initialStamina = 1000;
let stamina = initialStamina;
let nextStamina = stamina - 50;

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

const availableColorsHeat = [
  "#fc05e4",
  "#ff0fe8",
  "#ff1fe9",
  "#fc38e9",
  "#e04ad2",
  "#db65d0",
  "#e07bd7",
  "#e890e0",
  "#f0a3e9",
  "#f0b4ea",
  "#edc0e9",
  "#f2c9ef",
  "#f5d3f2",
  "#fadcf7",
  "#fae3f8",
  "#edddec",
  "#d4c9d3",
  // "#b8aeb7",
  // "#a39ba2",
  // "#918a90",
  // "#7a747a",
  // "#666166",
  // "#4d494d",
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
  } else if (iterations > MAX_ITERATIONS) {
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

const pushNote = (
  mandleNumber: number,
  i: number,
  j: number,
  currentTime: ToneJSDuration
) => {
  if (allowAudio) {
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
  }
};

const getXPosition = (xSquare: number) => {
  return centreX + (xSquare - 0.5 * xResolution) * xStepDistance;
};

const getYPosition = (ySquare: number) => {
  return centreY + (ySquare - 0.5 * yResolution) * yStepDistance;
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
  let sinceDifferentNumber = 1;
  Tone.Transport.bpm.value = 120;
  Tone.Transport.position = "0:0:0";
  let prevMandleNumber = -2;
  let currentTime: ToneJSDuration = { "16n": 0 };
  if (allowAudio) {
    Tone.start();
    Tone.Transport.cancel();
    instrument.releaseAll();
    instrument.sync();
  }
  for (let i = 0; i < xResolution; i++) {
    let xPosition = getXPosition(i);
    colors.push([]);
    for (let j = 0; j < yResolution; j++) {
      let yPosition = getYPosition(j);
      let mandleNumber = calculateMandlenumber(xPosition, yPosition, 0, 0, 0);
      if (mandleNumber != prevMandleNumber) {
        pushNote(mandleNumber, i, j, currentTime);
        currentTime["16n"] = (currentTime["16n"] ?? 0) + sinceDifferentNumber;
        sinceDifferentNumber = 1;
        prevMandleNumber = mandleNumber;
      } else {
        sinceDifferentNumber++;
      }
      if (mandleNumber == -1) {
        colors[i].push("white");
      } else {
        colors[i].push(
          availableColorsHeat[mandleNumber % availableColorsHeat.length]
        );
      }
    }
  }
  console.log("finished calculating colors");
  return colors;
};

const rectSideLength = 50;

let xResolution = 11;
let yResolution = 11;
let centreX = -2.001;
let centreY = 0;
let xStepDistance = 0.01;
let yStepDistance = 0.01;
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
        gl.fillRect(
          i * rectSideLength,
          j * rectSideLength,
          rectSideLength,
          rectSideLength
        );
        prevColors[i][j] = colors[i][j];
      }
    }
  }
};

const drawCharacter = ({
  xSquare,
  ySquare,
}: {
  xSquare: number;
  ySquare: number;
}) => {
  var canvas = document.getElementById("character-canvas") as any;
  var gl = canvas?.getContext("2d");

  gl.clearRect(0, 0, canvas.width, canvas.height);
  gl.fillStyle = "#000";
  gl.fillRect(
    (xSquare + 0.25) * rectSideLength,
    (ySquare + 0.25) * rectSideLength,
    0.5 * rectSideLength,
    0.5 * rectSideLength
  );
};

const characterPosition = {
  xSquare: 5,
  ySquare: 5,
};

drawCharacter(characterPosition);
recalculateColors();

const viewportUp = (steps: number) => {
  centreY = centreY - yStepDistance * steps;
  recalculateColors();
};

const viewportDown = (steps: number) => {
  centreY = centreY + yStepDistance * steps;
  recalculateColors();
};

const viewportLeft = (steps: number) => {
  centreX = centreX - xStepDistance * steps;
  recalculateColors();
};

const viewportRight = (steps: number) => {
  centreX = centreX + xStepDistance * steps;
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

const incrementStamina = ({
  xSquare,
  ySquare,
}: {
  xSquare: number;
  ySquare: number;
}) => {
  const mandleNumber = calculateMandlenumber(
    getXPosition(xSquare),
    getYPosition(ySquare),
    0,
    0,
    0
  );
  stamina = stamina - (mandleNumber === -1 ? MAX_ITERATIONS + 1 : mandleNumber - 5);
  if (stamina <= 0) {
    stamina = nextStamina;
    nextStamina = nextStamina - 50;
    if (stamina <= 0) {
      alert("Dead");
    } else {
      zoomIn();
    }
  }
  const descriptionElement = document.querySelector("#description");
  if (descriptionElement) {
    descriptionElement.innerHTML = stamina.toString();
  }
};

const characterUp = () => {
  if (characterPosition.ySquare <= 1) {
    viewportUp(yResolution - 2);
    characterPosition.ySquare = yResolution - 2;
    drawCharacter(characterPosition);
  } else {
    characterPosition.ySquare--;
    drawCharacter(characterPosition);
  }
  incrementStamina(characterPosition);
};

const characterDown = () => {
  if (characterPosition.ySquare >= yResolution - 2) {
    viewportDown(yResolution - 2);
    characterPosition.ySquare = 1;
    drawCharacter(characterPosition);
  } else {
    characterPosition.ySquare++;
    drawCharacter(characterPosition);
  }
  incrementStamina(characterPosition);
};

const characterLeft = () => {
  if (characterPosition.xSquare <= 1) {
    viewportLeft(xResolution - 2);
    characterPosition.xSquare = xResolution - 2;
    drawCharacter(characterPosition);
  } else {
    characterPosition.xSquare--;
    drawCharacter(characterPosition);
  }
  incrementStamina(characterPosition);
};

const characterRight = () => {
  if (characterPosition.xSquare >= xResolution - 2) {
    viewportRight(xResolution - 2);
    characterPosition.xSquare = 1;
    drawCharacter(characterPosition);
  } else {
    characterPosition.xSquare++;
    drawCharacter(characterPosition);
  }
  incrementStamina(characterPosition);
};

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
    instrument.sync();
    Tone.Transport.start();
  } else {
    allowAudio = true;
  }
};

document
  .querySelector("#explomandlebrotbox")
  ?.addEventListener("keypress", handleKeypress);
