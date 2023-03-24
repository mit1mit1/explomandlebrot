import { gridDistance, viewportCentre } from "../state";
import {
  MAX_ITERATIONS,
  rectSideLengthX,
  rectSideLengthY,
  xResolution,
  yResolution,
} from "../constants";
import { getXPosition, getYPosition } from "./grid";
import { calculateMandlenumber } from "./math";
import * as seedrandom from "seedrandom";

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

const availableColorsPallete1 = [
  "#2B2D40",
  "#8D97AE",
  "#F8F32B",
  "#FFFFEE",
  "#010201",
  // "#b8aeb7",
  // "#a39ba2",
  // "#918a90",
  // "#7a747a",
  // "#666166",
  // "#4d494d",
];

const availableColorsPallete2 = [
  "#BCE6EC",
  "#C391B3",
  "#AF3B6E",
  "#424255",
  "#20FB90",
  // "#b8aeb7",
  // "#a39ba2",
  // "#918a90",
  // "#7a747a",
  // "#666166",
  // "#4d494d",
];

const availableColorsPallete3 = [
  "#a3a382",
  "#d6ce91",
  "#effbce",
  "#d6a48f",
  "#ba8588",
];

const availableColorsPallete4 = [
  "#FFDEB9",
  "#FFDD83",
  "#FE6244",
  "#FC2947",
  "#E21818",
  "#98DFD6",
  "#7149C6",
  "#00235B",
  "#7149C6",
  "#98DFD6",
  "#E21818",
  "#FC2947",
  "#FE6244",
  "#FFDD83",
];

const generatedColorNumbers: number[] = [];

const seed =
  new URLSearchParams(window.location.search).get("randomSeed") || "d";

const seedMultiplier = 4095;

const myrng = seedrandom.alea(seed);

const colorGap =
  parseInt(
    new URLSearchParams(window.location.search).get("colorGap") || "0"
  ) || Math.floor((myrng() + 0.1) * 31);

generatedColorNumbers.push(Math.floor(myrng() * seedMultiplier));

for (let i = 1; i < MAX_ITERATIONS + 1; i++) {
  generatedColorNumbers.push(
    (generatedColorNumbers[generatedColorNumbers.length - 1] + colorGap) %
      seedMultiplier
  );
}

const getHexString = (num: number) =>
  ("#" + (num <= 16 * 16 ? "0" : "") + Math.floor(num).toString(16)).padEnd(
    7,
    "0"
  );

const generatedColors: string[] = generatedColorNumbers.map((num) =>
  getHexString(num)
);

let infiniteNumber = Math.floor(myrng() * seedMultiplier) + 130 * colorGap;
const iterations = 0;
while (generatedColorNumbers.includes(infiniteNumber) && iterations < 25) {
  infiniteNumber = Math.floor(myrng() * seedMultiplier) + 130 * colorGap;
}
const infiniteColor = getHexString(infiniteNumber);
console.log(infiniteColor);

export const getColors = (
  xStepDistance: number,
  centreX: number,
  yStepDistance: number,
  centreY: number
) => {
  const colors: Array<Array<string>> = [];
  for (let i = 0; i < xResolution; i++) {
    let xPosition = getXPosition(i, xStepDistance, centreX);
    colors.push([]);
    for (let j = 0; j < yResolution; j++) {
      let yPosition = getYPosition(j, yStepDistance, centreY);
      let mandleNumber = calculateMandlenumber(xPosition, yPosition, 0, 0, 0);
      if (mandleNumber == -1) {
        // colors[i].push(infiniteColor);
        colors[i].push("#eee");
      } else {
        colors[i].push(generatedColors[mandleNumber % generatedColors.length]);
      }
    }
  }
  return colors;
};

let colors = getColors(
  gridDistance.xStepDistance,
  viewportCentre.centreX,
  gridDistance.yStepDistance,
  viewportCentre.centreY
);
let prevColors = colors.map((colorArray) => colorArray.map(() => "non-color"));

export const recalculateColors = () => {
  colors = getColors(
    gridDistance.xStepDistance,
    viewportCentre.centreX,
    gridDistance.yStepDistance,
    viewportCentre.centreY
  );
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

recalculateColors();
