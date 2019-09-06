/** @format */

import Command from "./commandMaker";

const cmd = new Command("id", "name", "callback");

describe("parseShortcut", () => {
  it("should turn a string to a shortcut object", () => {
    expect(cmd.parseShortcut("control+c")).toEqual({
      isAlt: false,
      isCtrl: true,
      isMeta: false,
      isShift: false,
      key: "c",
    });
    expect(cmd.parseShortcut("alt+control+meta+shift+w")).toEqual({
      isAlt: true,
      isCtrl: true,
      isMeta: true,
      isShift: true,
      key: "w",
    });
    expect(cmd.parseShortcut("MetA+ALt+coNtRol+a")).toEqual({
      isAlt: true,
      isCtrl: true,
      isMeta: true,
      isShift: false,
      key: "a",
    });
    expect(cmd.parseShortcut("")).toEqual({
      isAlt: false,
      isCtrl: false,
      isMeta: false,
      isShift: false,
      key: "",
    });
    expect(cmd.parseShortcut("c")).toEqual({
      isAlt: false,
      isCtrl: false,
      isMeta: false,
      isShift: false,
      key: "c",
    });
  });
});
