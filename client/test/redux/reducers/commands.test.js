/** @format */

import commandReducer from "../../../src/renderer/redux/reducers/commands";
import * as types from "../../../src/renderer/redux/actionTypes";

describe("command reducer", () => {
  it("should handle ADD_COMMAND", () => {
    expect(
      commandReducer(
        { allIds: [], byId: {} },
        {
          type: types.ADD_COMMAND,
          payload: {
            id: "clipboard:copy",
            name: "copy",
            keys: "CmdOrCtrl+C",
            behaviour: "this.doClipboardCopy",
          },
        },
      ),
    ).toEqual({
      allIds: ["clipboard:copy"],
      byId: {
        "clipboard:copy": {
          id: "clipboard:copy",
          name: "copy",
          keys: "CmdOrCtrl+C",
          behaviour: "this.doClipboardCopy",
        },
      },
    });
  });
});
