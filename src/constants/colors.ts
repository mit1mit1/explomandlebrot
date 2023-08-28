import {
  colorGap,
  infiniteColorParam,
  myrng,
} from "./params";
import { MAX_ITERATIONS } from "./math";

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

// 2B2D40-8D97AE-F8F32B-FFFFEE-010201
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
const availableColorsPallete5 = [
  "#351431",
  "#775253",
  "#bdc696",
  "#d1d3c4",
  "#dfe0dc",
];
const availableColorsPallete6 = [
  "#f5bb00",
  "#ec9f05",
  "#d76a03",
  "#bf3100",
];

const pallete7 = [
  "#084b83",
  "#42bfdd",
  "#bbe6e4",
  "#f0f6f6",
  "#ff66b3",
];

const pallete8 = [
  "#fdfffc",
  "#235789",
  "#c1292e",
  "#f1d302",
  "#161925",
];
const pallete9 = [
  "#f433ab",
  "#cb04a5",
  "#934683",
  "#65334d",
  "#2d1115",
  "#bec5ad",
  "#a4b494",
  "#519872",
  "#3b5249",
  "#34252f",
];
const pallete10 = [
  "#ec91d8",
  "#ffaaea",
  "#ffbeef",
  "#ffd3da",
  "#e9d3d0",
  "#ffd3da",
  "#ffbeef",
  "#ffaaea",
];

const pallete11 = [
  "#966b9d",
  "#c98686",
  "#f2b880",
  "#fff4ec",
  "#e7cfbc",
];
const pallete12 = [
  "#6c756b",
  "#93acb5",
  "#96c5f7",
  "#a9d3ff",
  "#f2f4ff",
];
// const laDeDahPallete 6BAF00-799001-877000-955100-A33001-B10F00-BFF000-CCD000-DCB005-E99000-F76D02-F76D02-124000-211E00-3CDE00

export const generatedColorNumbers: number[] = [];

const seedMultiplier = 4095;

generatedColorNumbers.push(
  Math.floor(myrng() * seedMultiplier)
);

for (let i = 1; i < MAX_ITERATIONS + 1; i++) {
  generatedColorNumbers.push(
    (generatedColorNumbers[
      generatedColorNumbers.length - 1
    ] +
      colorGap) %
      seedMultiplier
  );
}

const getHexString = (num: number) =>
  (
    "#" +
    (num <= 16 * 16 ? "0" : "") +
    Math.floor(num).toString(16)
  ).padEnd(7, "0");

export const generatedColors: string[] = generatedColorNumbers.map(
  (num) => getHexString(num)
);

let infiniteNumber =
  Math.floor(myrng() * seedMultiplier) + 130 * colorGap;

const iterations = 0;
while (
  generatedColorNumbers.includes(infiniteNumber) &&
  iterations < 25
) {
  infiniteNumber =
    Math.floor(myrng() * seedMultiplier) + 130 * colorGap;
}
export const infiniteColor = infiniteColorParam
  ? `#${infiniteColorParam}`
  : "#eee";
// const infiniteColor = getHexString(infiniteNumber);
