const searchParams = new URLSearchParams(window.location.search);

export const xResolution = parseInt(searchParams.get("xResolution") || "108");
export const yResolution = parseInt(searchParams.get("yResolution") || "72");

const canvasXPixels = 1620;
const canvasYPixels = 1080;
export const rectSideLengthX = Math.floor(canvasXPixels / xResolution);
export const rectSideLengthY = Math.floor(canvasYPixels / yResolution);

export const initialXStepDistance = 0.05;
export const initialYStepDistance = 0.05;

export const MAX_ITERATIONS = 128;

export const stepMilliseconds = 15;

export const instrumentVolume = -24;

export const playerColor = "#000";
export const opponentColor = "#fff";
export const playerCanvas = "player-canvas";
export const opponentCanvas = "opponent-canvas";
export const gridZoomMultiplier = 2;
export const gridZoomDivider = 0.5;
