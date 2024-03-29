import {
  gridZoomDivider,
  gridZoomMultiplier,
  playerCanvas,
  playerColor,
  soundOn,
  xResolution,
  yResolution,
} from "../constants/params";
import { allowAudio } from "../";
import {
  characterPosition,
  gridDistance,
  viewportCentre,
  inputability,
  zoomDestination,
} from "../state";
import { recalculateColors } from "./colorCanvas";
import { drawCharacter, drawPopText } from "./drawing";
import { getSounds } from "./sounds";
import { setDepthPointer } from "./depthPointer";

export let changedViewportsInLastTwoSeconds = 0;

export const viewportUp = (steps: number) => {
  changedViewportsInLastTwoSeconds++;
  setTimeout(
    () => changedViewportsInLastTwoSeconds--,
    2000
  );
  viewportCentre.centreY =
    viewportCentre.centreY -
    gridDistance.yStepDistance * steps;
  recalculateColors();
  if (changedViewportsInLastTwoSeconds === 1) {
    if (soundOn) {
      getSounds(
        gridDistance.xStepDistance,
        viewportCentre.centreX,
        gridDistance.yStepDistance,
        viewportCentre.centreY,
        allowAudio
      );
    }
  }
};

export const viewportLeft = (steps: number) => {
  changedViewportsInLastTwoSeconds++;
  setTimeout(
    () => changedViewportsInLastTwoSeconds--,
    2000
  );
  viewportCentre.centreX =
    viewportCentre.centreX -
    gridDistance.xStepDistance * steps;
  recalculateColors();
  if (changedViewportsInLastTwoSeconds === 1 && soundOn) {
    getSounds(
      gridDistance.xStepDistance,
      viewportCentre.centreX,
      gridDistance.yStepDistance,
      viewportCentre.centreY,
      allowAudio
    );
  }
};

export const centreViewportOnCharacter = () => {
  changedViewportsInLastTwoSeconds++;
  setTimeout(
    () => changedViewportsInLastTwoSeconds--,
    2000
  );
  viewportCentre.centreX =
    viewportCentre.centreX -
    gridDistance.xStepDistance *
      (Math.floor(xResolution / 2) -
        characterPosition.xSquare);
  viewportCentre.centreY =
    viewportCentre.centreY -
    gridDistance.yStepDistance *
      (Math.floor(yResolution / 2) -
        characterPosition.ySquare);
  recalculateColors();
  characterPosition.xSquare = Math.floor(xResolution / 2);
  characterPosition.ySquare = Math.floor(yResolution / 2);
  drawCharacter(
    characterPosition,
    playerColor,
    playerCanvas
  );
  if (changedViewportsInLastTwoSeconds === 1 && soundOn) {
    getSounds(
      gridDistance.xStepDistance,
      viewportCentre.centreX,
      gridDistance.yStepDistance,
      viewportCentre.centreY,
      allowAudio
    );
  }
};

export const zoomOut = () => {
  if (inputability.actionable) {
    inputability.actionable = false;
    drawPopText("OUT!!", 250);
    centreViewportOnCharacter();
    gridDistance.xStepDistance =
      gridDistance.xStepDistance * gridZoomMultiplier;
    gridDistance.yStepDistance =
      gridDistance.yStepDistance * gridZoomMultiplier;
    recalculateColors();
    setTimeout(() => (inputability.actionable = true), 260);
    setDepthPointer(
      gridDistance.xStepDistance,
      zoomDestination.gridDistance
    );
  }
};

export const zoomIn = () => {
  if (inputability.actionable) {
    inputability.actionable = false;
    drawPopText("IN!", 250);
    centreViewportOnCharacter();
    gridDistance.xStepDistance =
      gridDistance.xStepDistance * gridZoomDivider;
    gridDistance.yStepDistance =
      gridDistance.yStepDistance * gridZoomDivider;
    recalculateColors();
    setTimeout(() => (inputability.actionable = true), 260);
    setDepthPointer(
      gridDistance.xStepDistance,
      zoomDestination.gridDistance
    );
  }
};

export const getXSquare = (xPosition: number) => {
  return (
    Math.floor(
      (xPosition - viewportCentre.centreX) /
        gridDistance.xStepDistance
    ) + Math.floor(xResolution / 2)
  );
};

export const getYSquare = (yPosition: number) => {
  return (
    Math.floor(
      (yPosition - viewportCentre.centreY) /
        gridDistance.yStepDistance
    ) + Math.floor(yResolution / 2)
  );
};
