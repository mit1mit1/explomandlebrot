import { rectSideLengthX, rectSideLengthY } from "../constants";
import { characterPosition } from "../state";

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