import { describe, expect, test } from "vitest";
import {
  shiftItem,
  uniqueArray,
  removeFromArray,
  updateInArray,
  isOccupied,
} from "./immutable-array";

const months = ["Jan", "Feb", "March", "April", "June"];

describe("uniqueArray", () => {
  test("should all be unique", () => {
    expect(uniqueArray([...months, ...months])).toEqual(months);
  });

  test("does not mutate original array", () => {
    const testArr = [1, 2, 3];

    uniqueArray(testArr);
    expect(testArr).toEqual([1, 2, 3]);
  });
});

describe("removeFromArray", () => {
  test("should remove @1", () => {
    expect(removeFromArray(months, 1)).toEqual([
      "Jan",
      "March",
      "April",
      "June",
    ]);
  });

  test("noop if out of range", () => {
    expect(removeFromArray(months, 99)).toEqual(months);
    expect(removeFromArray(months, -99)).toEqual(months);
  });

  test("does not mutate original array", () => {
    const testArr = [1, 2, 3];

    removeFromArray(testArr, 99);
    removeFromArray(testArr, -99);
    removeFromArray(testArr, 1);
    removeFromArray(testArr, -1);

    expect(testArr).toEqual([1, 2, 3]);
  });
});

describe("isOccupied", () => {
  test("returns true if array has any items", () => {
    expect(isOccupied(months)).toEqual(true);
  });

  test("returns false if non-array or has no items", () => {
    expect(isOccupied([])).toEqual(false);
    expect(isOccupied("months")).toEqual(false);
    expect(isOccupied("")).toEqual(false);
    expect(isOccupied({})).toEqual(false);
    expect(isOccupied({ abc: 123 })).toEqual(false);
    expect(isOccupied(undefined)).toEqual(false);
  });
});

describe("updateInArray", () => {
  test("should update @1", () => {
    expect(updateInArray(months, 1, "xxx")).toEqual([
      "Jan",
      "xxx",
      "March",
      "April",
      "June",
    ]);
  });

  test("append last if out of range", () => {
    expect(updateInArray(months, 99, "xxx")).toEqual([...months, "xxx"]);
  });

  test("replace first if negative out of range", () => {
    expect(updateInArray(months, -99, "xxx")).toEqual([
      "xxx",
      "Feb",
      "March",
      "April",
      "June",
    ]);
  });

  test("does not mutate original array", () => {
    const testArr = [1, 2, 3];

    updateInArray(testArr, -99, 9999);
    updateInArray(testArr, 99, 9999);
    updateInArray(testArr, 1, 9999);
    updateInArray(testArr, -1, 9999);

    expect(testArr).toEqual([1, 2, 3]);
  });
});

describe("shiftItem", () => {
  test("shift 1", () => {
    expect(shiftItem(months, 1, 1)).toEqual([
      "Jan",
      "March",
      "Feb",
      "April",
      "June",
    ]);
  });
  test("shift 2", () => {
    expect(shiftItem(months, 1, 2)).toEqual([
      "Jan",
      "March",
      "April",
      "Feb",
      "June",
    ]);
  });
  test("shift 99", () => {
    expect(shiftItem(months, 1, 99)).toEqual([
      "Jan",
      "March",
      "April",
      "June",
      "Feb",
    ]);
  });

  test("shift -1", () => {
    expect(shiftItem(months, 1, -1)).toEqual([
      "Feb",
      "Jan",
      "March",
      "April",
      "June",
    ]);
  });
  test("shift -2", () => {
    expect(shiftItem(months, 1, -2)).toEqual([
      "Feb",
      "Jan",
      "March",
      "April",
      "June",
    ]);
  });
  test("shift -99", () => {
    expect(shiftItem(months, 1, -2)).toEqual([
      "Feb",
      "Jan",
      "March",
      "April",
      "June",
    ]);
  });

  test("does not mutate original array", () => {
    const testArr = [1, 2, 3];

    shiftItem(testArr, 1, -99);
    shiftItem(testArr, 1, 99);
    shiftItem(testArr, 1, 1);
    shiftItem(testArr, 1, -1);

    expect(testArr).toEqual([1, 2, 3]);
  });
});
