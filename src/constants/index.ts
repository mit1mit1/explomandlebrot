const searchParams = new URLSearchParams(
  window.location.search
);

export const xResolution = parseInt(
  searchParams.get("xResolution") || "108"
);
export const yResolution = parseInt(
  searchParams.get("yResolution") || "72"
);
export const soundOn = !!searchParams.get("soundOn");

const canvasXPixels = 1620;
const canvasYPixels = 1080;
export const rectSideLengthX = Math.floor(
  canvasXPixels / xResolution
);
export const rectSideLengthY = Math.floor(
  canvasYPixels / yResolution
);

export const initialCentreX = parseFloat(
  searchParams.get("centreX") || "-2.001"
);
export const initialCentreY = parseFloat(
  searchParams.get("centreX") || "0"
);
export const initialXStepDistance = parseFloat(
  searchParams.get("xStepDistance") || "0.05"
);
export const initialYStepDistance = parseFloat(
  searchParams.get("yStepDistance") ||
    searchParams.get("xStepDistance") ||
    "0.05"
);

export const MAX_ITERATIONS = 128;

export const stepMilliseconds = 15;

export const instrumentVolume = -24;

export const playerColor = "#000";
export const opponentColor = "#fff";
export const playerCanvas = "player-canvas";
export const opponentCanvas = "opponent-canvas";
export const gridZoomMultiplier = 2;
export const gridZoomDivider = 0.5;

export const autoExplore = !!searchParams.get("autoExplore"); 
