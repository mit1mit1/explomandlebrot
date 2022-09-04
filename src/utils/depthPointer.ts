export const setDepthPointer = (
  currentGridDistance: number,
  destinationGridDistance: number
) => {
  const depthPointerElement = document.getElementById("depthPointer");
  if (depthPointerElement) {
    if (currentGridDistance === destinationGridDistance) {
      depthPointerElement.innerHTML = "=";
    } else if (currentGridDistance < destinationGridDistance) {
      depthPointerElement.innerHTML = "-";
    } else if (currentGridDistance > destinationGridDistance) {
      depthPointerElement.innerHTML = "+";
    }
  }
};
