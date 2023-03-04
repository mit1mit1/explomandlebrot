let showDepthPointer = false;

export const setDepthPointer = (
  currentGridDistance: number,
  destinationGridDistance: number
) => {
  const depthPointerElement = document.getElementById("depthPointer");
  if (depthPointerElement) {
    if (showDepthPointer) {
      if (currentGridDistance === destinationGridDistance) {
        depthPointerElement.innerHTML = "=";
      } else if (currentGridDistance < destinationGridDistance) {
        depthPointerElement.innerHTML = "-";
      } else if (currentGridDistance > destinationGridDistance) {
        depthPointerElement.innerHTML = "+";
      }
    } else {
      depthPointerElement.innerHTML = ""
    }
  }
};
