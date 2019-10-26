/** @format */

import pageStylesReducer from "./pageStyles";
import * as types from "../actions/types";

describe("page style reducer", () => {
  it("should handle SET_PAGE_STYLES", () => {
    const state = {
      orientation: "portrait",
      margin: "2cm 3cm",
      borderWidth: "1px",
      borderStyle: "solid",
    };

    const action = {
      type: types.SET_PAGE_STYLES,
      key: "size",
      value: "A4",
    }

    const expected = {
      size: "A4",
      orientation: "portrait",
      margin: "2cm 3cm",
      borderWidth: "1px",
      borderStyle: "solid",
    }

    expect(pageStylesReducer(state, action)).toEqual(expected);
  });
});
