/** @format */

import commandReducer from "./shortcuts";
import * as types from "../actions/types";

describe("shortcuts", () => {
  it("should handle ADD_DEFAULT_SHORTCUT", () => {
    expect(
      commandReducer(
        { allIds: [], byId: {} },
        {
          type: types.ADD_DEFAULT_SHORTCUT,
          id: "clipboard.copy",
          shortcuts: [
            {
              modifiers: ["control"],
              key: "c",
            },
          ]
        },
      ),
    ).toEqual({
      allIds: ["clipboard.copy"],
      byId: {
        "clipboard.copy": [
          {
            modifiers: ["control"],
            key: "c",
          }
        ],
      },
    });
  });
});
