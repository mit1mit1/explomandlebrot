import { detailMultiplier, xResolution, yResolution } from "../constants";

export const getXPosition = (
  xSquare: number,
  xStepDistance: number,
  centreX: number
) => {
  return centreX + (xSquare - 0.5 * xResolution) * xStepDistance / detailMultiplier;
};

export const getYPosition = (
  ySquare: number,
  yStepDistance: number,
  centreY: number
) => {
  return centreY + (ySquare - 0.5 * yResolution) * yStepDistance / detailMultiplier;
};
