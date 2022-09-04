const getAngleToDestination = (
  currentPosition: { xPosition: number; yPosition: number },
  destinationPosition: { xPosition: number; yPosition: number }
) => {
  return (
    Math.atan2(
      destinationPosition.yPosition - currentPosition.yPosition,
      destinationPosition.xPosition - currentPosition.xPosition
    ) *
    (180 / Math.PI) 
  );
};

export const setCompass = (
  currentPosition: { xPosition: number; yPosition: number },
  destinationPosition: { xPosition: number; yPosition: number }
) => {
  const compassElement = document.getElementById("compass");
  if (compassElement) {
    const rotateDegrees = getAngleToDestination(
      currentPosition,
      destinationPosition
    );
    compassElement.style.transform = `rotate(${rotateDegrees}deg)`;
  }
};
