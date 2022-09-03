import { viewportCentre } from "../state";
import { opponentCanvas, opponentColor } from "../constants";
import { getCharacterX, getCharacterY } from "./characterMovement";
import { drawCharacter } from "./drawing";
import { getXSquare, getYSquare } from "./viewport";

const params = new URLSearchParams(window.location.search);

export const playerId = parseInt(params.get("playerId") || "0");
export const opponentId = parseInt(params.get("opponentId") || "1");
export const serverString = params.get("serverString") || "";

export const sendPosition = (
  id: number,
  xPosition: number,
  yPosition: number
) => {
  if (!serverString) {
    return;
  }
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "PATCH",
    `https://${serverString}.au.ngrok.io/setPosition/${id}/${xPosition}/${yPosition}`,
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

const updatePositions = () => {
  sendPosition(playerId, getCharacterX(), getCharacterY());

  const playerPositionElement = document.getElementById("player-position");
  if (playerPositionElement) {
    playerPositionElement.innerHTML = `(${getCharacterX()}, ${getCharacterY()})`;
  }
  const opponentResponse = getPosition(opponentId);
  if (opponentResponse) {
    opponentResponse.onreadystatechange = () => {
      if (opponentResponse.readyState === XMLHttpRequest.DONE) {
        const opponentPositionElement =
          document.getElementById("opponent-position");
        if (opponentPositionElement && opponentResponse.responseText) {
          opponentPositionElement.innerHTML = opponentResponse.responseText;
        }
        const responseJson = JSON.parse(opponentResponse.responseText);
        const opponentPosition = {
          xSquare: getXSquare(responseJson.x),
          ySquare: getYSquare(responseJson.y),
        };
        drawCharacter(opponentPosition, opponentColor, opponentCanvas);
      }
    };
  }
};

window.setInterval(updatePositions, 250);
