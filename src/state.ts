import {
  initialXStepDistance,
  initialYStepDistance,
  xResolution,
  yResolution,
  gridZoomDivider,
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
  xPosition: parseFloat(
    searchParams.get("xDestination") || (0.5 * Math.random() + 0.5).toString()
  ),
  yPosition: parseFloat(
    searchParams.get("yDestination") || (0.5 * Math.random() + 0.5).toString()
  ),
};
console.log(initialXStepDistance * gridZoomDivider)
export const zoomDestination = {
  gridDistance: searchParams.get("zoomDestination")
    ? parseFloat(searchParams.get("zoomDestination") || "0")
    : initialXStepDistance * gridZoomDivider,
};
setDepthPointer(gridDistance.xStepDistance, zoomDestination.gridDistance);
