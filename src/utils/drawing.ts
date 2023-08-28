import { playerCanvas, playerColor, rectSideLengthX, rectSideLengthY } from "../constants/params";
import { characterPosition } from "../state";

export const drawPopText = (text: string, milliseconds: number) => {
  var canvas = document.getElementById("text-canvas") as any;
  var gl = canvas?.getContext("2d");

  gl.clearRect(0, 0, canvas.width, canvas.height);
  gl.fillStyle = "#2f2";
  gl.font = "90px Arial";
  gl.textAlign = "center";
  gl.fillText(text, 405, 270 + 35);
  setTimeout(() => gl.clearRect(0, 0, canvas.width, canvas.height), milliseconds);
};

export const drawCharacter = ({
  xSquare,
  ySquare,
}: {
  xSquare: number;
  ySquare: number;
}, characterColor: string, canvasId: string) => {
  var canvas = document.getElementById(canvasId) as any;
  var gl = canvas?.getContext("2d");

  gl.clearRect(0, 0, canvas.width, canvas.height);
  gl.fillStyle = characterColor;
  gl.fillRect(
    (xSquare + 0.25) * rectSideLengthX,
    (ySquare + 0.25) * rectSideLengthY,
    0.5 * rectSideLengthX,
    0.5 * rectSideLengthY
  );
};

drawCharacter(characterPosition, playerColor, playerCanvas);
