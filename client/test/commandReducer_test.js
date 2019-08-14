/** @format */

import commandReducer from "../src/renderer/redux/reducers/commands";
import * as type from "../src/renderer/redux/actionTypes";

describe("command reducer", () => {
  it("should handle ADD_COMMAND", () => {
    expect(
      commandReducer(
        { allIds: [], byId: {} },
        {
          type: type.ADD_COMMAND,
          payload: {
            id: "Clipboard:copy",
            name: "copy",
            keys: "CmdOrCtrl+C",
            behaviour: "this.doClipboardCopy",
          },
        }
      )
    ).toEqual({
      allIds: ["Clipboard:copy"],
      byId: {
        "Clipboard:copy": {
          id: "Clipboard:copy",
          name: "copy",
          keys: "CmdOrCtrl+C",
          behaviour: "this.doClipboardCopy",
        },
      },
    });
  });
});
