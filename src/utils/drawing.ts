import { rectSideLengthX, rectSideLengthY } from "../constants";
import { characterPosition } from "../state";

export const drawPopText = (text: string, milliseconds: number) => {
  var canvas = document.getElementById("text-canvas") as any;
  var gl = canvas?.getContext("2d");

  gl.clearRect(0, 0, canvas.width, canvas.height);
  gl.fillStyle = "#2f2";
  gl.font = "90px Arial";
  gl.fillText(text, 200, 200);
  setTimeout(() => gl.clearRect(0, 0, canvas.width, canvas.height), milliseconds);
};

export const drawCharacter = ({
  xSquare,
  ySquare,
}: {
  xSquare: number;
  ySquare: number;
}) => {
  var canvas = document.getElementById("character-canvas") as any;
  var gl = canvas?.getContext("2d");

  gl.clearRect(0, 0, canvas.width, canvas.height);
  gl.fillStyle = "#000";
  gl.fillRect(
    (xSquare + 0.25) * rectSideLengthX,
    (ySquare + 0.25) * rectSideLengthY,
    0.5 * rectSideLengthX,
    0.5 * rectSideLengthY
  );
};

drawCharacter(characterPosition);
