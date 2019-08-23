/** @format */

import * as actions from "./actions";
import * as types from "./actionTypes";

describe("actions", () => {
  it("should create an action to set metadata", () => {
    const key = "title";
    const data = "Updated title";

    const expectedAction = {
      type: types.SET_METADATA,
      key,
      data,
    };
    expect(actions.setMetadata(key, data)).toEqual(expectedAction);
  });
});
