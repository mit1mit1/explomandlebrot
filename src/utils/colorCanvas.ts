import { gridDistance, viewportCentre } from "../state";
import {
  autoExplore,
  colorArray,
  rectSideLengthX,
  rectSideLengthY,
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
  bottomToTopVenetianSweep,
  getLeftRightSemiRandomDissolve,
  topToBottomVenetianSweep,
} from "../constants/grid";

let sweepLeft = true;

const mandlerrainCanvas = document.getElementById(
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
      (0.1 + Math.log(xStepDistance)) /
        (128 * Math.log(0.5))
    ) {
      gridDistance.xStepDistance =
        (gridDistance.xStepDistance * 2) / 3;
      gridDistance.yStepDistance =
        (gridDistance.yStepDistance * 2) / 3;
    } else {
      gridDistance.xStepDistance =
        (gridDistance.xStepDistance * 3) / 2;
      gridDistance.yStepDistance =
        (gridDistance.yStepDistance * 3) / 2;
    }
    sweepLeft = !sweepLeft;
    console.log("focussing on", { ...gridDistance });
    recalculateColors();
  }
};

const pushRow = (
  i: number,
  mandleNumbers: number[][],
  xStepDistance: number,
  yStepDistance: number,
  centreX: number,
  centreY: number,
  mapping: TwoDimensionMap
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
        50
      );
    }
  }
  if (i < xResolution) {
    let gl = mandlerrainCanvas?.getContext("2d", {
      alpha: false,
    });
    for (let j = 0; j < yResolution; j++) {
      const { xIndex, yIndex } = mapping[i][j];
      // sweepLeft
      //   ? leftToRightSweep[i * yResolution + j]
      // //   : rightToLeftSweep[i * yResolution + j];
      // const xIndex = Math.floor((j * xResolution + i) / yResolution);
      // const yIndex = (j * xResolution + i) - xIndex * yResolution;
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
          centreY,
          mapping
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
    centreY,
    getLeftRightSemiRandomDissolve()
  );
};

export const recalculateColors = () => {
  console.log("recalculating colors");
  getColors(
    gridDistance.xStepDistance,
    viewportCentre.centreX,
    gridDistance.yStepDistance,
    viewportCentre.centreY
  );
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
