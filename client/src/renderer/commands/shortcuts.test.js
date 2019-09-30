/** @format */

import {parseShortcut} from "./shortcuts.js";
import createCommand from "./";

const command = createCommand("clipboard.copy", "copy", "callback");
const shortcut = {modifiers: ["control"], key: "c"};

describe("parseShortcut", () => {
  it("should return a complete shortcut object from a command and a shortcut description", () => {
    expect(parseShortcut(command, shortcut)).toEqual({
      id: "clipboard.copy",
      modifiers: ["control"],
      key: "c",
    });
  });
});
