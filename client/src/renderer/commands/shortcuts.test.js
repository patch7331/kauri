/** @format */

import { readJSON } from "./shortcuts.js";

describe("readJSON", () => {
  it("should return an object containing the shortcuts and their ids in the JSON", () => {
    const expectedJSON = {
      "clipboard.copy": [
        { modifiers: ["control"], key: "c", },
        { modifiers: ["control"], key: "v", },
      ],
      "clipboard.paste": [
        { modifiers: ["control", "shift"], key: "c" },
        { modifiers: ["control", "shift"], key: "v" }
      ]
    };
    expect.assertions(1);
    return readJSON().then(json => expect(json).toEqual(expectedJSON));
  });
});
