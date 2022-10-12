import {
  initialXStepDistance,
  initialYStepDistance,
  xResolution,
  yResolution,
  gridZoomDivider,
} from "./constants";
import { setDepthPointer } from "./utils/depthPointer";
import { calculateMandlenumber } from "./utils/math";

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

const paramXDestination = searchParams.get("xDestination");
const paramYDestination = searchParams.get("yDestination");

export const zoomDestination = {
  gridDistance: searchParams.get("zoomDestination")
    ? parseFloat(searchParams.get("zoomDestination") || "0")
    : initialXStepDistance *
      gridZoomDivider ** (Math.floor(Math.random() * 7) + 4),
};
setDepthPointer(gridDistance.xStepDistance, zoomDestination.gridDistance);

const isReachable = (
  compassDestination: { xPosition: number; yPosition: number },
  zoomDestination: { gridDistance: number }
) => {
  const destinationMandleNumber = calculateMandlenumber(
    compassDestination.xPosition,
    compassDestination.yPosition,
    0,
    0,
    0
  );
  const adjacentMandleNumbers = [
    calculateMandlenumber(
      compassDestination.xPosition + zoomDestination.gridDistance,
      compassDestination.yPosition,
      0,
      0,
      0
    ),
    calculateMandlenumber(
      compassDestination.xPosition - zoomDestination.gridDistance,
      compassDestination.yPosition,
      0,
      0,
      0
    ),
    calculateMandlenumber(
      compassDestination.xPosition,
      compassDestination.yPosition + zoomDestination.gridDistance,
      0,
      0,
      0
    ),
    calculateMandlenumber(
      compassDestination.xPosition,
      compassDestination.yPosition - zoomDestination.gridDistance,
      0,
      0,
      0
    ),
  ];
  return adjacentMandleNumbers.some(
    (number) => number !== destinationMandleNumber
  );
};

export const compassDestination = {
  xPosition: parseFloat(paramXDestination || "0"),
  yPosition: parseFloat(paramYDestination || "0"),
};

if (!paramXDestination && !paramYDestination) {
  let attemptsToSetCompass = 0;
  while (
    attemptsToSetCompass < 15 &&
    !isReachable(compassDestination, zoomDestination)
  ) {
    const positiveX = (-1) ** Math.floor(Math.random() * 2);
    const positiveY = (-1) ** Math.floor(Math.random() * 2);
    compassDestination.xPosition = (0.5 + 0.5 * Math.random()) * positiveX;
    compassDestination.yPosition = 0.5 + 0.5 * Math.random() * positiveY;
  }
}
