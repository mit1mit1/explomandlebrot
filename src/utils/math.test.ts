import { calculateMandlenumber } from "./math";

describe("calculateMandlenumber", () => {
  it("should return number of iterations it takes to pass our arbitrary threshold", () => {
    expect(calculateMandlenumber(0.4, 0.8, 0, 0, 0)).toBe(4);
  });

  it("should return 0 if already out of range", () => {
    expect(calculateMandlenumber(51, 0, 0, 0, 0)).toBe(0);
  });

  it("should return negative one if max iterations passed", () => {
    expect(calculateMandlenumber(0, 0, 0, 0, 0)).toBe(-1);
  });

  it("should cope with recalculating", () => {
    expect(calculateMandlenumber(0.4, 0.8, 0, 0, 0)).toBe(4);
    expect(calculateMandlenumber(0.4, 0.8, 0, 0, 0)).toBe(4);
  });
});
