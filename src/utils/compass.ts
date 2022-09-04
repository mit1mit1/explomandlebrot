import { compassDestination, gridDistance, zoomDestination } from "../state";
import { getCharacterX, getCharacterY } from "./characterMovement";

const getAngleToDestination = (
  currentPosition: { xPosition: number; yPosition: number },
  destinationPosition: { xPosition: number; yPosition: number }
) => {
  return (
    Math.atan2(
      destinationPosition.yPosition - currentPosition.yPosition,
      destinationPosition.xPosition - currentPosition.xPosition
    ) *
    (180 / Math.PI)
  );
};

const pageLoadedTime = Date.now();

const checkIfFound = () => {
  if (
    Math.abs(getCharacterX() - compassDestination.xPosition) <
      3 * gridDistance.xStepDistance &&
    Math.abs(getCharacterY() - compassDestination.yPosition) <
      3 * gridDistance.yStepDistance &&
    gridDistance.xStepDistance < 3 * zoomDestination.gridDistance &&
    zoomDestination.gridDistance < 3 * gridDistance.xStepDistance
  ) {
    const foundTime = Date.now();
    const secondsDiff = (foundTime - pageLoadedTime) / 1000;
    alert(`Nice, found in ${secondsDiff} seconds`);
  }
  
};

export const setCompass = (
  currentPosition: { xPosition: number; yPosition: number },
  destinationPosition: { xPosition: number; yPosition: number }
) => {
  const compassElement = document.getElementById("compass");
  if (compassElement) {
    const rotateDegrees = getAngleToDestination(
      currentPosition,
      destinationPosition
    );
    compassElement.style.transform = `rotate(${rotateDegrees}deg)`;
  }
  checkIfFound();
};
