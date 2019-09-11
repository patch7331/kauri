/** @format */

import * as types from "./types";
import { cacheNode, cacheWorkingArea } from "./renderCache";

describe("cache node action creator", () => {
  it("should create a cache node action", () => {
    const expected = {
      type: types.CACHE_NODE,
      id: 1,
      height: 150,
    };

    expect(cacheNode(1, 150)).toEqual(expected);
  });
});

describe("cache working area action creator", () => {
  it("should create a cache working area action", () => {
    const expected = {
      type: types.CACHE_WORKING_AREA,
      width: 150,
      height: 250,
    };

    expect(cacheWorkingArea(150, 150)).toEqual(expected);
  });
});
