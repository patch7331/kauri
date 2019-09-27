/** @format */

import {getJSON} from "./index.js";

const expectedJSON = [
  {
    "isAlt": false,
    "isCtrl": true,
    "isMeta": false,
    "isShift": true,
    "key": "c"
  },
  {
    "isAlt": false,
    "isCtrl": true,
    "isMeta": false,
    "isShift": true,
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
