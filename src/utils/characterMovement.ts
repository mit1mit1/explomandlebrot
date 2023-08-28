import {
  MAX_ITERATIONS,
  stepMilliseconds,
} from "../constants/math";
import {
  xResolution,
  yResolution,
  playerColor,
  playerCanvas,
} from "../constants/params";
import {
  character,
  characterPosition,
  compassDestination,
  gridDistance,
  inputability,
  viewportCentre,
} from "../state";
import { setCompass } from "./compass";
import { drawCharacter, drawPopText } from "./drawing";
import { getXPosition, getYPosition } from "./grid";
import { calculateMandlenumber } from "./math";
import {
  viewportLeft,
  viewportUp,
  zoomIn,
} from "./viewport";

const incrementStamina = (mandleNumber: number) => {
  character.stamina =
    character.stamina -
    (mandleNumber === -1
      ? MAX_ITERATIONS + 1
      : mandleNumber - 5);
  if (character.stamina <= 0) {
    character.stamina = character.nextStamina;
    character.nextStamina = character.nextStamina - 50;
    if (character.stamina <= 0) {
      drawPopText("Dead", 5000);
    } else {
      zoomIn();
    }
  }
  const descriptionElement =
    document.querySelector("#description");
  if (descriptionElement) {
    descriptionElement.innerHTML =
      character.stamina.toString();
  }
};

export const characterUp = () => {
  if (characterPosition.ySquare <= 1) {
    viewportUp(yResolution - 2);
    characterPosition.ySquare = yResolution - 2;
    drawCharacter(
      characterPosition,
      playerColor,
      playerCanvas
    );
  } else {
    characterPosition.ySquare--;
    drawCharacter(
      characterPosition,
      playerColor,
      playerCanvas
    );
  }
};

export const characterDown = () => {
  if (characterPosition.ySquare >= yResolution - 2) {
    viewportUp(-(yResolution - 2));
    characterPosition.ySquare = 1;
    drawCharacter(
      characterPosition,
      playerColor,
      playerCanvas
    );
  } else {
    characterPosition.ySquare++;
    drawCharacter(
      characterPosition,
      playerColor,
      playerCanvas
    );
  }
};

export const characterLeft = () => {
  if (characterPosition.xSquare <= 1) {
    viewportLeft(xResolution - 2);
    characterPosition.xSquare = xResolution - 2;
    drawCharacter(
      characterPosition,
      playerColor,
      playerCanvas
    );
  } else {
    characterPosition.xSquare--;
    drawCharacter(
      characterPosition,
      playerColor,
      playerCanvas
    );
  }
};

export const characterRight = () => {
  if (characterPosition.xSquare >= xResolution - 2) {
    viewportLeft(-(xResolution - 2));
    characterPosition.xSquare = 1;
    drawCharacter(
      characterPosition,
      playerColor,
      playerCanvas
    );
  } else {
    characterPosition.xSquare++;
    drawCharacter(
      characterPosition,
      playerColor,
      playerCanvas
    );
  }
};

export const getCharacterX = () => {
  return getXPosition(
    characterPosition.xSquare,
    gridDistance.xStepDistance,
    viewportCentre.centreX
  );
};

export const getCharacterY = () => {
  return getYPosition(
    characterPosition.ySquare,
    gridDistance.yStepDistance,
    viewportCentre.centreY
  );
};

export const slide = async (
  direction: "up" | "down" | "left" | "right",
  retries: number
) => {
  if (inputability.actionable) {
    inputability.actionable = false;
    const currentMandlenumber = calculateMandlenumber(
      getCharacterX(),
      getCharacterY(),
      0,
      0,
      0
    );
    let newMandlenumber = currentMandlenumber;
    let slides = 0;
    while (
      newMandlenumber === currentMandlenumber &&
      slides < 100
    ) {
      if (direction == "up") {
        characterUp();
      }
      if (direction == "down") {
        characterDown();
      }
      if (direction == "left") {
        characterLeft();
      }
      if (direction == "right") {
        characterRight();
      }
      setCompass(
        {
          xPosition: getCharacterX(),
          yPosition: getCharacterY(),
        },
        compassDestination
      );
      newMandlenumber = calculateMandlenumber(
        getXPosition(
          characterPosition.xSquare,
          gridDistance.xStepDistance,
          viewportCentre.centreX
        ),
        getYPosition(
          characterPosition.ySquare,
          gridDistance.yStepDistance,
          viewportCentre.centreY
        ),
        0,
        0,
        0
      );
      slides++;
      if (newMandlenumber === currentMandlenumber) {
        await new Promise((r) =>
          setTimeout(r, stepMilliseconds)
        );
      }
    }
    if (slides > 1) {
      if (direction == "up") {
        characterDown();
      }
      if (direction == "down") {
        characterUp();
      }
      if (direction == "left") {
        characterRight();
      }
      if (direction == "right") {
        characterLeft();
      }
    }
    // incrementStamina(newMandlenumber);
    setCompass(
      {
        xPosition: getCharacterX(),
        yPosition: getCharacterY(),
      },
      compassDestination
    );
    inputability.actionable = true;
  } else {
    if (retries < 10) {
      setTimeout(
        () => slide(direction, retries + 1),
        stepMilliseconds + 2
      );
    }
  }
};
