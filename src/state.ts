import {
  initialXStepDistance,
  initialYStepDistance,
  xResolution,
  yResolution,
} from "./constants";

export const characterPosition = {
  xSquare: Math.floor(xResolution / 2),
  ySquare: Math.floor(yResolution / 2),
};

export const viewportCentre = {
  centreX: -2.001,
  centreY: 0,
};

export const character = {
  stamina: 1000,
  nextStamina: 950,
};

export const gridDistance = {
  xStepDistance: initialXStepDistance,
  yStepDistance: initialYStepDistance,
};
