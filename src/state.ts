import {
  initialXStepDistance,
  initialYStepDistance,
  xResolution,
  yResolution,
} from "./constants";
import { setDepthPointer } from "./utils/depthPointer";

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

export const inputability = {
  actionable: true,
};

const searchParams = new URLSearchParams(window.location.search);

export const compassDestination = {
  xPosition: parseFloat(searchParams.get("xDestination") || "0"),
  yPosition: parseFloat(searchParams.get("yDestination") || "0"),
};

export const zoomDestination = {
  gridDistance: parseFloat(searchParams.get("zoomDestination") || "1"),
};
setDepthPointer(gridDistance.xStepDistance, zoomDestination.gridDistance);
