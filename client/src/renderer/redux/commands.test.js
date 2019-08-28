/** @format */

import * as actions from "./actions";
import * as types from "./actionTypes";

describe("actions", () => {
  it("should create an action to add a command", () => {
    const id = "clipboard:copy";
    const name = "copy";
    const keys = "CmdOrCtrl+C";
    const behaviour = "this.doClipboardCopy";

    const expectedAction = {
      type: types.ADD_COMMAND,
      payload: {
        id,
        name,
        keys,
        behaviour,
      },
    };
    expect(actions.addCommand(id, name, keys, behaviour)).toEqual(
      expectedAction,
    );
  });
});
