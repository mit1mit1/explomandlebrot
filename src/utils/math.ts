import { MAX_ITERATIONS } from "../constants/math";

const calculatedNumbers: Map<
  number,
  Map<number, number>
> = new Map();

export const calculateMandlenumber = (
  xPosition: number,
  yPosition: number,
  prevResultX: number,
  prevResultY: number,
  iterations: number
): number => {
  let calculatedNumbersX = calculatedNumbers.get(xPosition);
  if (!calculatedNumbersX) {
    calculatedNumbersX = new Map();
    calculatedNumbers.set(xPosition, calculatedNumbersX);
  }
  const calculatedNumber = calculatedNumbersX
    ? calculatedNumbersX.get(yPosition)
    : undefined;
  if (calculatedNumber) {
    return calculatedNumber;
  }
  const nextResultX =
    xPosition +
    prevResultX * prevResultX -
    prevResultY * prevResultY;
  const nextResultY =
    yPosition + 2 * prevResultX * prevResultY;

  const magnitude =
    nextResultX * nextResultX + nextResultY * nextResultY;

  if (magnitude > 50) {
    calculatedNumbersX.set(yPosition, iterations);
    return iterations;
  } else if (iterations > MAX_ITERATIONS) {
    calculatedNumbersX.set(yPosition, -1);
    return -1;
  } else {
    return calculateMandlenumber(
      xPosition,
      yPosition,
      nextResultX,
      nextResultY,
      iterations + 1
    );
  }
};
