import { getXPosition, getYPosition } from "./grid";

describe("getXPosition", () => {
  it("should return the absolute x position from the centre and the number of steps away and the resolution", () => {
    expect(getXPosition(4, 2, 0)).toBe(-792);
  });
});

describe("getYPosition", () => {
  it("should return the absolute x position from the centre and the number of steps away and the resolution", () => {
    expect(getYPosition(4, 4, 0)).toBe(-884);
  });
});
