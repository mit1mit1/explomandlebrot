import {
  compassDestination,
  gridDistance,
  viewportCentre,
  zoomDestination,
} from "../state";
import { opponentCanvas, opponentColor } from "../constants/params";
import { getCharacterX, getCharacterY } from "./characterMovement";
import { drawCharacter } from "./drawing";
import { getXSquare, getYSquare } from "./viewport";
import { setCompass } from "./compass";
import { setDepthPointer } from "./depthPointer";

const params = new URLSearchParams(window.location.search);

export const playerId = parseInt(params.get("playerId") || "0");
console.log("player id is ", playerId);
export const opponentId = parseInt(params.get("opponentId") || "1");
console.log("opponent id is ", opponentId);
export const serverString = params.get("serverString") || "";

export const sendPosition = (
  id: number,
  xPosition: number,
  yPosition: number,
  gridDistance: number
) => {
  if (!serverString) {
    return;
  }
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "PATCH",
    `https://${serverString}.au.ngrok.io/setPosition/${id}/${xPosition}/${yPosition}/${gridDistance}`,
    true
  );
  xhttp.send();
};

export const getPosition = (id: number) => {
  if (!serverString) {
    return;
  }
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "PATCH",
    `https://${serverString}.au.ngrok.io/getPosition/${id}`,
    true
  );
  xhttp.send();
  return xhttp;
};

let showPositions = false;

const updatePositions = () => {
  sendPosition(
    playerId,
    getCharacterX(),
    getCharacterY(),
    gridDistance.xStepDistance
  );

  const playerPositionElement = document.getElementById("player-position");
  if (playerPositionElement) {
    if (showPositions) {
      playerPositionElement.innerHTML = `(${getCharacterX()}, ${getCharacterY()}, ${
        gridDistance.xStepDistance
      })`;
    } else {
      playerPositionElement.innerHTML = '';
    }
  }
  const opponentResponse = getPosition(opponentId);
  if (opponentResponse) {
    opponentResponse.onreadystatechange = () => {
      if (opponentResponse.readyState === XMLHttpRequest.DONE) {
        const responseJson = JSON.parse(opponentResponse.responseText);
        compassDestination.xPosition = responseJson.x;
        compassDestination.yPosition = responseJson.y;
        zoomDestination.gridDistance = responseJson.gridDistance;
        setCompass(
          { xPosition: getCharacterX(), yPosition: getCharacterY() },
          compassDestination
        );
        setDepthPointer(
          gridDistance.xStepDistance,
          zoomDestination.gridDistance
        );
        const opponentPosition = {
          xSquare: getXSquare(responseJson.x),
          ySquare: getYSquare(responseJson.y),
        };
        drawCharacter(opponentPosition, opponentColor, opponentCanvas);
      }
    };
  }
};

window.setInterval(updatePositions, 1000);
