/** @format */

import { getJSON } from "./index.js";

const expectedJSON = [
  {
    "modifiers": ["control", "shift"],
    "key": "c"
  },
  {
    "modifiers": ["control", "shift"],
    "key": "v"
  }
]

describe("getJSON", () => {
  it("should return the paste array", () => {
    getJSON().then(json => {
      expect(json).toEqual(expectedJSON);
    });
  });
});
