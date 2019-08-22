/** @format */

import * as actions from "../../../src/renderer/redux/actions";
import * as types from "../../../src/renderer/redux/actionTypes";

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
