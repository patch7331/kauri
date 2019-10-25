/** @format */

import * as actions from "./commands";
import * as types from "./types";

describe("command actions", () => {
  it("should create an action to add a command", () => {
    const id = "clipboard:copy";
    const name = "copy";
    const callback = "this.doClipboardCopy";

    const expectedAction = {
      type: types.ADD_COMMAND,
      id,
      name,
      callback,
    };

    expect(actions.addCommand(id, name, callback)).toEqual(expectedAction);
  });
});
