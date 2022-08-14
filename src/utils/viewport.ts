import { xResolution, yResolution } from "../constants";
import { allowAudio } from "../";
import {
  characterPosition,
  gridDistance,
  viewportCentre,
  inputability,
} from "../state";
import { recalculateColors } from "./colors";
import { drawCharacter, drawPopText } from "./drawing";
import { getSounds } from "./sounds";

export const viewportUp = (steps: number) => {
  viewportCentre.centreY =
    viewportCentre.centreY - gridDistance.yStepDistance * steps;
  recalculateColors();
  getSounds(
    gridDistance.xStepDistance,
    viewportCentre.centreX,
    gridDistance.yStepDistance,
    viewportCentre.centreY,
    allowAudio
  );
};

export const viewportLeft = (steps: number) => {
  viewportCentre.centreX =
    viewportCentre.centreX - gridDistance.xStepDistance * steps;
  recalculateColors();
  getSounds(
    gridDistance.xStepDistance,
    viewportCentre.centreX,
    gridDistance.yStepDistance,
    viewportCentre.centreY,
    allowAudio
  );
};

export const centreViewportOnCharacter = () => {
  viewportCentre.centreX =
    viewportCentre.centreX -
    gridDistance.xStepDistance *
      (Math.floor(xResolution / 2) - characterPosition.xSquare);
  viewportCentre.centreY =
    viewportCentre.centreY -
    gridDistance.yStepDistance *
      (Math.floor(yResolution / 2) - characterPosition.ySquare);
  recalculateColors();
  characterPosition.xSquare = Math.floor(xResolution / 2);
  characterPosition.ySquare = Math.floor(yResolution / 2);
  drawCharacter(characterPosition);
  getSounds(
    gridDistance.xStepDistance,
    viewportCentre.centreX,
    gridDistance.yStepDistance,
    viewportCentre.centreY,
    allowAudio
  );
};

export const zoomOut = () => {
  if (inputability.actionable) {
    inputability.actionable = false;
    drawPopText("OUT!!", 250);
    centreViewportOnCharacter();
    gridDistance.xStepDistance = gridDistance.xStepDistance * 2;
    gridDistance.yStepDistance = gridDistance.yStepDistance * 2;
    recalculateColors();
    setTimeout(() => (inputability.actionable = true), 260);
  }
};

export const zoomIn = () => {
  if (inputability.actionable) {
    inputability.actionable = false;
    drawPopText("IN!", 250);
    centreViewportOnCharacter();
    gridDistance.xStepDistance = gridDistance.xStepDistance * 0.5;
    gridDistance.yStepDistance = gridDistance.yStepDistance * 0.5;
    recalculateColors();
    setTimeout(() => (inputability.actionable = true), 260);
  }
};
