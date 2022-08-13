import * as Tone from "tone";
import { getColors } from "./utils/colors";
import { getXPosition, getYPosition } from "./utils/grid";
import { calculateMandlenumber } from "./utils/math";
import {
  initialXStepDistance,
  initialYStepDistance,
  MAX_ITERATIONS,
  rectSideLengthX,
  rectSideLengthY,
  xResolution,
  yResolution,
} from "./constants";
import { getSounds } from "./utils/sounds";
import PianoMp3 from "tonejs-instrument-piano-mp3";

let allowAudio = false;

let initialStamina = 1000;
let stamina = initialStamina;
let nextStamina = stamina - 50;

let centreX = -2.001;
let centreY = 0;
let xStepDistance = initialXStepDistance;
let yStepDistance = initialYStepDistance;
let colors = getColors(xStepDistance, centreX, yStepDistance, centreY);
let prevColors = colors.map((colorArray) => colorArray.map(() => "#000"));

const recalculateColors = () => {
  colors = getColors(xStepDistance, centreX, yStepDistance, centreY);
  var canvas = document.getElementById("mandlerrain-canvas") as any;
  var gl = canvas?.getContext("2d", { alpha: false });
  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < colors[i].length; j++) {
      if (prevColors[i][j] !== colors[i][j]) {
        gl.fillStyle = colors[i][j];
        gl.fillRect(
          i * rectSideLengthX,
          j * rectSideLengthY,
          rectSideLengthX,
          rectSideLengthY
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
    (xSquare + 0.25) * rectSideLengthX,
    (ySquare + 0.25) * rectSideLengthY,
    0.5 * rectSideLengthX,
    0.5 * rectSideLengthY
  );
};

const characterPosition = {
  xSquare: Math.floor(xResolution / 2),
  ySquare: Math.floor(yResolution / 2),
};

drawCharacter(characterPosition);
recalculateColors();

const viewportUp = (steps: number) => {
  centreY = centreY - yStepDistance * steps;
  recalculateColors();
  getSounds(xStepDistance, centreX, yStepDistance, centreY, allowAudio);
};

const viewportDown = (steps: number) => {
  centreY = centreY + yStepDistance * steps;
  recalculateColors();
  getSounds(xStepDistance, centreX, yStepDistance, centreY, allowAudio);
};

const viewportLeft = (steps: number) => {
  centreX = centreX - xStepDistance * steps;
  recalculateColors();
  getSounds(xStepDistance, centreX, yStepDistance, centreY, allowAudio);
};

const viewportRight = (steps: number) => {
  centreX = centreX + xStepDistance * steps;
  recalculateColors();
  getSounds(xStepDistance, centreX, yStepDistance, centreY, allowAudio);
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
    getXPosition(xSquare, xStepDistance, centreX),
    getYPosition(ySquare, yStepDistance, centreY),
    0,
    0,
    0
  );
  stamina =
    stamina - (mandleNumber === -1 ? MAX_ITERATIONS + 1 : mandleNumber - 5);
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
