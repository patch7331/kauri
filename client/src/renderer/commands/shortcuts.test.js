/** @format */

import { readJSON } from "./shortcuts.js";

describe("readJSON", () => {
  it("should return an object containing the shortcuts and their ids in the JSON", () => {
    const expectedJSON = {
      "clipboard.copy": [
        { modifiers: ["ctrl"], key: "c" },
        { modifiers: ["ctrl"], key: "v" },
      ],
      "clipboard.paste": [
        { modifiers: ["ctrl", "shift"], key: "c" },
        { modifiers: ["ctrl", "shift"], key: "v" },
      ],
    };
    expect.assertions(1);
    return readJSON().then(json => expect(json).toEqual(expectedJSON));
  });
});
