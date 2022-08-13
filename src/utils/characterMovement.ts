import { MAX_ITERATIONS, xResolution, yResolution } from "../constants";
import {
  character,
  characterPosition,
  gridDistance,
  viewportCentre,
} from "../state";
import { drawCharacter } from "./drawing";
import { getXPosition, getYPosition } from "./grid";
import { calculateMandlenumber } from "./math";
import {
  viewportDown,
  viewportLeft,
  viewportRight,
  viewportUp,
  zoomIn,
} from "./viewport";

const incrementStamina = ({
  xSquare,
  ySquare,
}: {
  xSquare: number;
  ySquare: number;
}) => {
  const mandleNumber = calculateMandlenumber(
    getXPosition(xSquare, gridDistance.xStepDistance, viewportCentre.centreX),
    getYPosition(ySquare, gridDistance.yStepDistance, viewportCentre.centreY),
    0,
    0,
    0
  );
  character.stamina =
    character.stamina -
    (mandleNumber === -1 ? MAX_ITERATIONS + 1 : mandleNumber - 5);
  if (character.stamina <= 0) {
    character.stamina = character.nextStamina;
    character.nextStamina = character.nextStamina - 50;
    if (character.stamina <= 0) {
      alert("Dead");
    } else {
      zoomIn();
    }
  }
  const descriptionElement = document.querySelector("#description");
  if (descriptionElement) {
    descriptionElement.innerHTML = character.stamina.toString();
  }
};

export const characterUp = () => {
  if (characterPosition.ySquare <= 1) {
    viewportUp(yResolution - 2);
    characterPosition.ySquare = yResolution - 2;
    drawCharacter(characterPosition);
  } else {
    characterPosition.ySquare--;
    drawCharacter(characterPosition);
  }
  incrementStamina(characterPosition);
};

export const characterDown = () => {
  if (characterPosition.ySquare >= yResolution - 2) {
    viewportDown(yResolution - 2);
    characterPosition.ySquare = 1;
    drawCharacter(characterPosition);
  } else {
    characterPosition.ySquare++;
    drawCharacter(characterPosition);
  }
  incrementStamina(characterPosition);
};

export const characterLeft = () => {
  if (characterPosition.xSquare <= 1) {
    viewportLeft(xResolution - 2);
    characterPosition.xSquare = xResolution - 2;
    drawCharacter(characterPosition);
  } else {
    characterPosition.xSquare--;
    drawCharacter(characterPosition);
  }
  incrementStamina(characterPosition);
};

export const characterRight = () => {
  if (characterPosition.xSquare >= xResolution - 2) {
    viewportRight(xResolution - 2);
    characterPosition.xSquare = 1;
    drawCharacter(characterPosition);
  } else {
    characterPosition.xSquare++;
    drawCharacter(characterPosition);
  }
  incrementStamina(characterPosition);
};
