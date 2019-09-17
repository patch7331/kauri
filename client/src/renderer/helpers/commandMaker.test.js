/** @format */

import Command from "./commandMaker";

describe("parseShortcut", () => {
  it("should turn a string to a shortcut object", () => {
    expect(parseShortcut("control+c")).toEqual({
      isAlt: false,
      isCtrl: true,
      isMeta: false,
      isShift: false,
      key: "c",
    });
  });
  it("Should recognise shortcuts out of order, as long as it ends in the letter", () => {
    expect(parseShortcut("alt+control+meta+shift+w")).toEqual({
      isAlt: true,
      isCtrl: true,
      isMeta: true,
      isShift: true,
      key: "w",
    });
  });
  it("Should ignore case", () => {
    expect(parseShortcut("MetA+ALt+coNtRol+A")).toEqual({
      isAlt: true,
      isCtrl: true,
      isMeta: true,
      isShift: false,
      key: "a",
    });
  });
  it("Should throw an error on empty input", () => {
    expect(parseShortcut("")).toThrow();
  });
  it("Should accept just a key", () => {
    expect(parseShortcut("c")).toEqual({
      isAlt: false,
      isCtrl: false,
      isMeta: false,
      isShift: false,
      key: "c",
    });
  });
});
