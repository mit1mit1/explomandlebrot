import { xResolution, yResolution } from "./params";

export const modulo = (n: number, base: number) =>
  ((n % base) + base) % base;

export const leftRightBiassedShuffle = (
  coordinateMap: TwoDimensionMap
) => {
  let currentXIndex = coordinateMap.length;
  let randomXIndex;
  let randomYIndex;

  // While there remain elements to leftRightBiassedShuffle.
  while (currentXIndex !== 0) {
    // Pick a remaining element.
    randomXIndex = Math.floor(
      Math.random() * currentXIndex
    );
    currentXIndex--;
    let currentYIndex = coordinateMap[0].length;
    while (currentYIndex !== 0) {
      randomYIndex = Math.floor(
        Math.random() * currentYIndex
      );
      currentYIndex--;

      // And swap it with the current element.
      [
        coordinateMap[currentXIndex][currentYIndex],
        coordinateMap[randomXIndex][randomYIndex],
      ] = [
        { ...coordinateMap[randomXIndex][randomYIndex] },
        { ...coordinateMap[currentXIndex][currentYIndex] },
      ];
    }
  }

  return coordinateMap;
};

export interface Coordinate {
  xIndex: number;
  yIndex: number;
}

export type TwoDimensionMap = Coordinate[][];

export const leftToRightSweep: TwoDimensionMap = [];
for (let i = 0; i < xResolution; i++) {
  const row = [];
  for (let j = 0; j < yResolution; j++) {
    row.push({ xIndex: i, yIndex: j });
  }
  leftToRightSweep.push(row);
}

export const rightToLeftSweep: TwoDimensionMap = [];
for (let i = 0; i < xResolution; i++) {
  const row = [];
  for (let j = 0; j < yResolution; j++) {
    row.push({ xIndex: xResolution - i - 1, yIndex: j });
  }
  rightToLeftSweep.push(row);
}

export const topToBottomVenetianSweep: TwoDimensionMap = [];
for (let i = 0; i < xResolution; i++) {
  const row = [];
  for (let j = 0; j < yResolution; j++) {
    const xIndex = Math.floor(
      (j * xResolution + i) / yResolution
    );
    row.push({
      xIndex,
      yIndex: j * xResolution + i - xIndex * yResolution,
    });
  }
  topToBottomVenetianSweep.push(row);
}

export const topToBottomFullSweep: TwoDimensionMap = [];
for (let i = 0; i < xResolution; i++) {
  const row = [];
  for (let j = 0; j < yResolution; j++) {
    const yIndex = Math.floor(
      (i * yResolution + j) / xResolution
    );
    row.push({
      yIndex,
      xIndex: i * yResolution + j - yIndex * xResolution,
    });
  }
  topToBottomFullSweep.push(row);
}

export const bottomToTopVenetianSweep: TwoDimensionMap = [];
for (let i = 0; i < xResolution; i++) {
  const row = [];
  for (let j = 0; j < yResolution; j++) {
    row.push({
      xIndex:
        topToBottomVenetianSweep[xResolution - i - 1][j]
          .xIndex,
      yIndex:
        topToBottomVenetianSweep[xResolution - i - 1][j]
          .yIndex,
    });
  }
  bottomToTopVenetianSweep.push(row);
}

export const getLeftToRightSemiRandomDissolve = () =>
  leftRightBiassedShuffle(
    JSON.parse(JSON.stringify(leftToRightSweep))
  );

export const getRightToLeftSemiRandomDissolve = () => {
  const leftRightBiassedShuffle =
    getLeftToRightSemiRandomDissolve();
  const rightToLeftBiassedShuffle = [];
  for (let i = 0; i < xResolution; i++) {
    const row = [];
    for (let j = 0; j < yResolution; j++) {
      row.push({
        ...leftRightBiassedShuffle[xResolution - i - 1][j],
      });
    }
    rightToLeftBiassedShuffle.push(row);
  }
  return rightToLeftBiassedShuffle;
};
