import { gridDistance, viewportCentre } from "../state";
import {
  autoExplore,
  colorArray,
  rectSideLengthX,
  rectSideLengthY,
  soundOn,
  xResolution,
  yResolution,
} from "../constants/params";
import { getXPosition, getYPosition } from "./grid";
import { calculateMandlenumber } from "./math";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";
import {
  generatedColors,
  infiniteColor,
} from "../constants/colors";
import {
  TwoDimensionMap,
  availableTransitionGenerators,
  bottomToTopVenetianSweep,
  getLeftToRightSemiRandomDissolve,
  getRightToLeftSemiRandomDissolve,
  modulo,
  topToBottomVenetianSweep,
} from "../constants/grid";
import { getSounds } from "./sounds";
import { allowAudio } from "../";

const absoluteCentreX = Math.floor(xResolution / 2);
const absoluteCentreY = Math.floor(yResolution / 2);

const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

const mandlerrainCanvas = document.getElementById(
  "mandlerrain-canvas"
) as any;

const gl = mandlerrainCanvas?.getContext("2d", {
  alpha: false,
});

const fillMandlesquare = (
  mandleNumber: number,
  xStart: number,
  yStart: number,
  squareXLength: number,
  squareYLength: number
) => {
  if (mandleNumber == -1) {
    gl.fillStyle = infiniteColor;
  } else {
    if (colorArray.length > 1) {
      gl.fillStyle =
        colorArray[mandleNumber % colorArray.length];
    } else {
      gl.fillStyle =
        generatedColors[
          mandleNumber % generatedColors.length
        ];
    }
  }
  gl.fillRect(xStart, yStart, squareXLength, squareYLength);
};

const quickZoom = (
  zoomMultiplier: number,
  mandleNumbers: number[][]
) => {
  console.log("starting quick zoom", mandleNumbers);
  const adjustedSideLengthX =
    rectSideLengthX / zoomMultiplier;
  const adjustedSideLengthY =
    rectSideLengthY / zoomMultiplier;
  mandleNumbers.forEach((column, xIndex) => {
    if (!column) {
      return;
    }
    column.forEach((mandleNumber, yIndex) => {
      // console.log(xIndex, yIndex, mandleNumber);
      let i = xIndex;
      let j = yIndex;
      fillMandlesquare(
        mandleNumber,
        (absoluteCentreX +
          (absoluteCentreX - i) *
            (1 - 1 / zoomMultiplier)) *
          rectSideLengthX,
        (absoluteCentreY +
          (absoluteCentreY - j) *
            (1 - 1 / zoomMultiplier)) *
          rectSideLengthY,
        adjustedSideLengthX,
        adjustedSideLengthY
      );
    });
  });
};

const quickTranslate = (
  newCenter: {
    xIndex: number;
    yIndex: number;
  },
  mandleNumbers: number[][]
) => {
  const translatedMandlenumbers: number[][] = [];
  const translateX = absoluteCentreX - newCenter.xIndex;
  const translateY = absoluteCentreY - newCenter.yIndex;
  let gl = mandlerrainCanvas?.getContext("2d", {
    alpha: false,
  });
  for (let i = 0; i < xResolution; i++) {
    let adjustedXIndex = i + translateX;
    translatedMandlenumbers[adjustedXIndex] = [];
    for (let j = 0; j < yResolution; j++) {
      let adjustedYIndex = j + translateY;
      translatedMandlenumbers[adjustedXIndex][
        adjustedYIndex
      ] = mandleNumbers[i][j];
      let mandleNumber = mandleNumbers[i][j];

      // console.log(
      //   "painting",
      //   adjustedXIndex,
      //   adjustedYIndex,
      //   mandleNumber
      // );
      // gl.fillStyle = "#123";
      // gl.fillRect(
      //   adjustedXIndex * rectSideLengthX,
      //   adjustedYIndex * rectSideLengthY,
      //   rectSideLengthX,
      //   rectSideLengthY
      // );
      fillMandlesquare(
        mandleNumber,
        adjustedXIndex * rectSideLengthX,
        adjustedYIndex * rectSideLengthY,
        rectSideLengthX,
        rectSideLengthY
      );
    }
    return translatedMandlenumbers;
    // alert("finishing quick recolor");
  }
};

const focusOnNextInterestingPoint = async (
  mandleNumbers: number[][],
  xStepDistance: number,
  yStepDistance: number,
  centreX: number,
  centreY: number,
  currentTransitionMapIndex: number
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
    const zoomMultiplier =
      Math.random() >
      Math.log(xStepDistance) / (256 * Math.log(0.5))
        ? 2 / 3
        : 3 / 2;
    // const translatedMandlenumbers = quickTranslate(
    //   newCenter,
    //   mandleNumbers
    // );
    // await sleep(100);
    // quickZoom(zoomMultiplier, translatedMandlenumbers);
    // await sleep(100);
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
    gridDistance.xStepDistance =
      gridDistance.xStepDistance * zoomMultiplier;
    gridDistance.yStepDistance =
      gridDistance.yStepDistance * zoomMultiplier;

    recalculateColors(
      modulo(
        currentTransitionMapIndex + 1,
        availableTransitionGenerators.length
      )
    );
  }
};

const pushRow = async (
  i: number,
  mandleNumbers: number[][],
  xStepDistance: number,
  yStepDistance: number,
  centreX: number,
  centreY: number,
  mapping: TwoDimensionMap
) => {
  if (i >= xResolution) {
    return;
  }
  if (i < xResolution) {
    for (let j = 0; j < yResolution; j++) {
      const { xIndex, yIndex } = mapping[i][j];
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
      fillMandlesquare(
        mandleNumber,
        xIndex * rectSideLengthX,
        yIndex * rectSideLengthY,
        rectSideLengthX,
        rectSideLengthY
      );
    }
    await sleep(10);
    await pushRow(
      i + 1,
      mandleNumbers,
      xStepDistance,
      yStepDistance,
      centreX,
      centreY,
      mapping
    );
  }
};

export const recalculateColors = async (
  transitionMapIndex = 0
) => {
  console.log("pushing colors for");
  console.log({ ...viewportCentre }, { ...gridDistance });
  console.log(
    `centreX=${viewportCentre.centreX}&centreY=${viewportCentre.centreY}&xStepDistance=${gridDistance.xStepDistance}&yStepDistance${gridDistance.yStepDistance}`
  );
  if (soundOn) {
    await getSounds(
      gridDistance.xStepDistance,
      viewportCentre.centreX,
      gridDistance.yStepDistance,
      viewportCentre.centreY,
      allowAudio
    );
  }

  const mandleNumbers: Array<Array<number>> = Array.from(
    { length: xResolution },
    () => []
  );

  await pushRow(
    0,
    mandleNumbers,
    gridDistance.xStepDistance,
    gridDistance.yStepDistance,
    viewportCentre.centreX,
    viewportCentre.centreY,
    availableTransitionGenerators[transitionMapIndex]()
  );

  if (autoExplore) {
    await focusOnNextInterestingPoint(
      mandleNumbers,
      gridDistance.xStepDistance,
      gridDistance.yStepDistance,
      viewportCentre.centreX,
      viewportCentre.centreY,
      transitionMapIndex
    );
  }
};
export const recorder = new RecordRTC(mandlerrainCanvas, {
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
