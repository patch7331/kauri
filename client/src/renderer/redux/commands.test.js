/** @format */

import * as actions from "./actions";
import * as types from "./actionTypes";
import Command from "../commands";

describe("actions", () => {
  it("should create an action to add a command", () => {
    const id = "clipboard:copy";
    const name = "copy";
    const keys = "control+C";
    const callback = "this.doClipboardCopy";

    const cmd = new Command(id, name, callback);
    cmd.createShortcut(keys);

    const expectedAction = {
      type: types.ADD_COMMAND,
      payload: {
        id,
        name,
        shortcuts: [
          {
            id: 1,
            isAlt: false,
            isCtrl: true,
            isMeta: false,
            isShift: false,
            key: "c",
          },
        ],
        callback,
      },
    };
    expect(actions.addCommand(cmd)).toEqual(expectedAction);
  });
});
