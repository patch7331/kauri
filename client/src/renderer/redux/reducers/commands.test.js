/** @format */

import commandReducer from "./commands";
import * as types from "../actions/types";

describe("command reducer", () => {
  it("should handle ADD_COMMAND", () => {
    expect(
      commandReducer(
        { allIds: [], byId: {} },
        {
          type: types.ADD_COMMAND,
          id: "clipboard:copy",
          name: "copy",
          callback: "this.doClipboardCopy",
        },
      ),
    ).toEqual({
      allIds: ["clipboard:copy"],
      byId: {
        "clipboard:copy": {
          id: "clipboard:copy",
          name: "copy",
          callback: "this.doClipboardCopy",
        },
      },
    });
  });
});
