import { allowAudio } from "../";
import { gridDistance, viewportCentre } from "../state";
import { recalculateColors } from "./colors";
import { getSounds } from "./sounds";

export const viewportUp = (steps: number) => {
  viewportCentre.centreY = viewportCentre.centreY - gridDistance.yStepDistance * steps;
  recalculateColors();
  getSounds(gridDistance.xStepDistance, viewportCentre.centreX, gridDistance.yStepDistance, viewportCentre.centreY, allowAudio);
};

export const viewportDown = (steps: number) => {
  viewportCentre.centreY = viewportCentre.centreY + gridDistance.yStepDistance * steps;
  recalculateColors();
  getSounds(gridDistance.xStepDistance, viewportCentre.centreX, gridDistance.yStepDistance, viewportCentre.centreY, allowAudio);
};

export const viewportLeft = (steps: number) => {
  viewportCentre.centreX = viewportCentre.centreX - gridDistance.xStepDistance * steps;
  recalculateColors();
  getSounds(gridDistance.xStepDistance, viewportCentre.centreX, gridDistance.yStepDistance, viewportCentre.centreY, allowAudio);
};

export const viewportRight = (steps: number) => {
  viewportCentre.centreX = viewportCentre.centreX + gridDistance.xStepDistance * steps;
  recalculateColors();
  getSounds(gridDistance.xStepDistance, viewportCentre.centreX, gridDistance.yStepDistance, viewportCentre.centreY, allowAudio);
};

export const zoomOut = () => {
  gridDistance.xStepDistance = gridDistance.xStepDistance * 2;
  gridDistance.yStepDistance = gridDistance.yStepDistance * 2;
  recalculateColors();
};

export const zoomIn = () => {
  gridDistance.xStepDistance = gridDistance.xStepDistance * 0.5;
  gridDistance.yStepDistance = gridDistance.yStepDistance * 0.5;
  recalculateColors();
};
