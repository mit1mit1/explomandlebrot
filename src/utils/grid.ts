import { xResolution, yResolution } from "../constants/params";

export const getXPosition = (
  xSquare: number,
  xStepDistance: number,
  centreX: number
) => {
  return centreX + (xSquare - 0.5 * xResolution) * xStepDistance;
};

export const getYPosition = (
  ySquare: number,
  yStepDistance: number,
  centreY: number
) => {
  return centreY + (ySquare - 0.5 * yResolution) * yStepDistance;
};
