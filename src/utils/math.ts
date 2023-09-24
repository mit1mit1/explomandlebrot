import { MAX_ITERATIONS } from "../constants/math";

const calculatedNumbers: Map<
  number,
  Map<number, number>
> = new Map();

type Mode = "mandlebrot" | "nova";

let mode: Mode = "mandlebrot";

// Nova seems to be too hard to compute? Timing out on low res and iteration max
const getNextResult = (
  xPosition: number,
  yPosition: number,
  prevResultX: number,
  prevResultY: number
) => {
  let nextPosition = {
    nextResultX: 0,
    nextResultY: 0,
  };
  switch (mode) {
    case "mandlebrot":
      nextPosition = {
        nextResultX:
          xPosition +
          prevResultX * prevResultX -
          prevResultY * prevResultY,
        nextResultY:
          yPosition + 2 * prevResultX * prevResultY,
      };
      break;
    case "nova":
      nextPosition = {
        nextResultX:
          xPosition +
          prevResultX -
          (1 /
            (3 *
              (prevResultX ** 2 - prevResultY ** 2) ** 2)) *
            ((prevResultX ** 2 - prevResultY ** 2) *
              (prevResultX - 1) ** 3 -
              3 * prevResultY ** 2 * (prevResultX - 1) +
              2 *
                prevResultY *
                (3 * prevResultY - prevResultY ** 3)),
        nextResultY:
          yPosition +
          prevResultY -
          (1 /
            (3 *
              (prevResultX ** 2 - prevResultY ** 2) ** 2)) *
            ((prevResultX ** 2 - prevResultY ** 2) *
              (3 * prevResultY - prevResultY ** 3) -
              2 *
                prevResultY *
                ((prevResultX - 1) ** 3 -
                  3 *
                    prevResultY ** 2 *
                    (prevResultX - 1))),
      };
      break;
  }
  return nextPosition;
};

export const calculateMandlenumber = (
  xPosition: number,
  yPosition: number,
  prevResultX: number,
  prevResultY: number,
  iterations: number
): number => {
  // alert(iterations);
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
  // const { nextResultX, nextResultY } = {
  //   ...getNextResult(
  //     xPosition,
  //     yPosition,
  //     prevResultX,
  //     prevResultY
  //   ),
  // };
  const nextResultX =
    xPosition +
    prevResultX * prevResultX -
    prevResultY * prevResultY;
  const nextResultY =
    yPosition + 2 * prevResultX * prevResultY;
  const magnitude =
    nextResultX * nextResultX + nextResultY * nextResultY;
  // console.log(magnitude);
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
