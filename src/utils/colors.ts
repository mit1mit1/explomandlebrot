import { gridDistance, viewportCentre } from "../state";
import {
  MAX_ITERATIONS,
  autoExplore,
  gridZoomDivider,
  gridZoomMultiplier,
  rectSideLengthX,
  rectSideLengthY,
  xResolution,
  yResolution,
} from "../constants";
import { getXPosition, getYPosition } from "./grid";
import { calculateMandlenumber } from "./math";
import * as seedrandom from "seedrandom";
import RecordRTC, {
  CanvasRecorder,
  invokeSaveAsDialog,
} from "recordrtc";

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
const generatedColorNumbers: number[] = [];

const searchParams = new URLSearchParams(
  window.location.search
);

const seed = searchParams.get("randomSeed") || "d";

const seedMultiplier = 4095;

const myrng = seedrandom.alea(seed);

const colorGap =
  parseInt(searchParams.get("colorGap") || "0") ||
  Math.floor((myrng() + 0.1) * 31);

const colorArray = (searchParams.get("colorArray") || "")
  .split("-")
  .map((color) => `#${color}`);

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

const modulo = (n: number, base: number) =>
  ((n % base) + base) % base;

const shuffle = (array: number[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const getHexString = (num: number) =>
  (
    "#" +
    (num <= 16 * 16 ? "0" : "") +
    Math.floor(num).toString(16)
  ).padEnd(7, "0");

const generatedColors: string[] = generatedColorNumbers.map(
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
const infiniteColor = searchParams.get("infiniteColor")
  ? `#${searchParams.get("infiniteColor")}`
  : "#eee";
// const infiniteColor = getHexString(infiniteNumber);
const indexes = [];
for (var n = 0; n < xResolution * yResolution; n++) {
  indexes.push(n);
}
const indexMap = [...indexes];

const canvas = document.getElementById(
  "mandlerrain-canvas"
) as any;

const focusOnNextInterestingPoint = (
  mandleNumbers: number[][],
  xStepDistance: number,
  yStepDistance: number,
  centreX: number,
  centreY: number
) => {
  let maxDifferentNeighbours = 0;
  let maxBoundaryElements: Array<{
    xIndex: number;
    yIndex: number;
  }> = [];
  for (let x = 1; x < xResolution - 1; x++) {
    for (let y = 1; y < yResolution - 1; y++) {
      const localMandlenumber = mandleNumbers[x][y];
      let differentNeighbours = 0;
      if (
        mandleNumbers[x - 1][y - 1] !== localMandlenumber
      ) {
        differentNeighbours++;
      }
      if (mandleNumbers[x - 1][y] !== localMandlenumber) {
        differentNeighbours++;
      }
      if (
        mandleNumbers[x - 1][y + 1] !== localMandlenumber
      ) {
        differentNeighbours++;
      }
      if (mandleNumbers[x][y - 1] !== localMandlenumber) {
        differentNeighbours++;
      }
      if (mandleNumbers[x][y + 1] !== localMandlenumber) {
        differentNeighbours++;
      }
      if (
        mandleNumbers[x + 1][y - 1] !== localMandlenumber
      ) {
        differentNeighbours++;
      }
      if (mandleNumbers[x + 1][y] !== localMandlenumber) {
        differentNeighbours++;
      }
      if (
        mandleNumbers[x + 1][y + 1] !== localMandlenumber
      ) {
        differentNeighbours++;
      }

      if (differentNeighbours > maxDifferentNeighbours) {
        maxDifferentNeighbours = differentNeighbours;
        maxBoundaryElements = [];
      }

      if (
        differentNeighbours === maxDifferentNeighbours &&
        differentNeighbours > 0
      ) {
        maxBoundaryElements.push({
          xIndex: x,
          yIndex: y,
        });
      }
    }
  }
  if (maxBoundaryElements.length > 0) {
    const newCenter =
      maxBoundaryElements[
        Math.floor(
          Math.random() * maxBoundaryElements.length
        )
      ];
    viewportCentre.centreX = getXPosition(
      newCenter.xIndex,
      xStepDistance,
      centreX
    );
    viewportCentre.centreY = getYPosition(
      newCenter.yIndex,
      yStepDistance,
      centreY
    );
    if (
      Math.random() >
      (0.1 + Math.log(xStepDistance)) / (64 * Math.log(0.5))
    ) {
      gridDistance.xStepDistance =
        gridDistance.xStepDistance * gridZoomDivider;
      gridDistance.yStepDistance =
        gridDistance.yStepDistance * gridZoomDivider;
    } else {
      gridDistance.xStepDistance =
        gridDistance.xStepDistance * gridZoomMultiplier;
      gridDistance.yStepDistance =
        gridDistance.yStepDistance * gridZoomMultiplier;
    }
    recalculateColors();
  }
};

const pushRow = (
  i: number,
  mandleNumbers: number[][],
  xStepDistance: number,
  yStepDistance: number,
  centreX: number,
  centreY: number
) => {
  if (i >= xResolution) {
    if (autoExplore) {
      setTimeout(
        () =>
          focusOnNextInterestingPoint(
            mandleNumbers,
            xStepDistance,
            yStepDistance,
            centreX,
            centreY
          ),
        1000
      );
    }
  }
  if (i < xResolution) {
    let gl = canvas?.getContext("2d", { alpha: false });
    for (let j = 0; j < yResolution; j++) {
      const indexTotal = indexMap[i * yResolution + j];
      const xIndex = Math.floor(indexTotal / yResolution);
      const yIndex = indexTotal - xIndex * yResolution;
      let xPosition = getXPosition(
        xIndex,
        xStepDistance,
        centreX
      );
      let yPosition = getYPosition(
        yIndex,
        yStepDistance,
        centreY
      );
      let mandleNumber = calculateMandlenumber(
        xPosition,
        yPosition,
        0,
        0,
        0
      );
      mandleNumbers[xIndex][yIndex] = mandleNumber;
      if (mandleNumber == -1) {
        gl.fillStyle = infiniteColor;
        gl.fillRect(
          xIndex * rectSideLengthX,
          yIndex * rectSideLengthY,
          rectSideLengthX,
          rectSideLengthY
        );
      } else {
        if (colorArray.length > 1) {
          gl.fillStyle =
            colorArray[mandleNumber % colorArray.length];
          gl.fillRect(
            xIndex * rectSideLengthX,
            yIndex * rectSideLengthY,
            rectSideLengthX,
            rectSideLengthY
          );
        } else {
          gl.fillStyle =
            generatedColors[
              mandleNumber % generatedColors.length
            ];
          gl.fillRect(
            xIndex * rectSideLengthX,
            yIndex * rectSideLengthY,
            rectSideLengthX,
            rectSideLengthY
          );
        }
      }
    }
    setTimeout(
      () =>
        pushRow(
          i + 1,
          mandleNumbers,
          xStepDistance,
          yStepDistance,
          centreX,
          centreY
        ),
      10
    );
  }
};

export const getColors = (
  xStepDistance: number,
  centreX: number,
  yStepDistance: number,
  centreY: number
) => {
  const mandleNumbers: Array<Array<number>> = Array.from(
    { length: xResolution },
    () => []
  );
  pushRow(
    0,
    mandleNumbers,
    xStepDistance,
    yStepDistance,
    centreX,
    centreY
  );
};

// getColors(
//   gridDistance.xStepDistance,
//   viewportCentre.centreX,
//   gridDistance.yStepDistance,
//   viewportCentre.centreY
// );

export const recalculateColors = () => {
  console.log("recalculating colors");
  getColors(
    gridDistance.xStepDistance,
    viewportCentre.centreX,
    gridDistance.yStepDistance,
    viewportCentre.centreY
  );
  // var canvas = document.getElementById(
  //   "mandlerrain-canvas"
  // ) as any;
  // var gl = canvas?.getContext("2d", { alpha: false });
  // for (let i = 0; i < colors.length; i++) {
  //   for (let j = 0; j < colors[i].length; j++) {
  //     if (prevColors[i][j] !== colors[i][j]) {
  //       gl.fillStyle = colors[i][j];
  //       gl.fillRect(
  //         i * rectSideLengthX,
  //         j * rectSideLengthY,
  //         rectSideLengthX,
  //         rectSideLengthY
  //       );
  //       prevColors[i][j] = colors[i][j];
  //     }
  //   }
  // }
};
export const recorder = new RecordRTC(canvas, {
  type: "canvas",
  mimeType: "video/webm;codecs=vp9",
});
recorder.startRecording();

export const saveRecording = () => {
  // recorder.stopRecording(function () {
  //   recorder.getDataURL((url) => window.open(url));
  // });
  recorder.stopRecording(function () {
    var recordedBlobs = recorder.getBlob();
    console.log(recordedBlobs);
    var file = new File([recordedBlobs], "video.webm", {
      type: "video/webm",
    });

    invokeSaveAsDialog(file);
    // var video = document.createElement("video");
    // video.src = URL.createObjectURL(recordedBlobs);
    // video.setAttribute("style", "height: 100%;");
    // document.body.appendChild(video);
    // video.controls = true;
    // video.play();
  });
};

setTimeout(saveRecording, 1000 * 60 * 30);

recalculateColors();
