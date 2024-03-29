import { compassDestination, gridDistance, zoomDestination } from "../state";
import { getCharacterX, getCharacterY } from "./characterMovement";

let showCompass = false;

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

let found = false;

const checkIfFound = () => {
  if (
    !found &&
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
    found = true;
  }
};

export const setCompass = (
  currentPosition: { xPosition: number; yPosition: number },
  destinationPosition: { xPosition: number; yPosition: number }
) => {
  const compassElement = document.getElementById("compass");
  if (compassElement) {
    if (showCompass) {
      const rotateDegrees = getAngleToDestination(
        currentPosition,
        destinationPosition
      );
      compassElement.innerHTML = '--->';
      compassElement.style.transform = `rotate(${rotateDegrees}deg)`;
    } else {
      compassElement.innerHTML = '';
    }
  }
  checkIfFound();
};
