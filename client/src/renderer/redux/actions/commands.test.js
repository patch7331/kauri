/** @format */

import { createCommand, addShortcut } from "../../commands";
import * as actions from "./commands";
import * as types from "./types";

describe("command actions", () => {
  it("should create an action to add a command", () => {
    const id = "clipboard:copy";
    const name = "copy";
    const callback = "this.doClipboardCopy";

    const cmd = createCommand(id, name, callback);

    const expectedAction = {
      type: types.ADD_COMMAND,
      command: {
        id,
        name,
        callback,
      },
    };
    expect(actions.addCommand(cmd)).toEqual(expectedAction);
  });
});
