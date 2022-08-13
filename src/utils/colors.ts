import { xResolution, yResolution } from "../constants";
import { getXPosition, getYPosition } from "./grid";
import { calculateMandlenumber } from "./math";

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
        colors[i].push("white");
      } else {
        colors[i].push(
          availableColorsHeat[mandleNumber % availableColorsHeat.length]
        );
      }
    }
  }
  return colors;
};
