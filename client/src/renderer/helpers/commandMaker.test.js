/** @format */

import Command from "./commandMaker";

describe("parseShortcut", () => {
  it("should turn a string to a shortcut object", () => {
	expect(
		parseShortcut("control+c")
	).toEqual({
		isAlt: false,
		isCtrl: true,
		isMeta: false,
		isShift: false,
		key: "c",
	});
	expect(
		parseShortcut("alt+control+meta+shift+w")
	).toEqual({
		isAlt: true,
		isCtrl: true,
		isMeta: true,
		isShift: true,
		key: "w",
	});
	expect(
		parseShortcut("MetA+ALt+coNtRol+a")
	).toEqual({
		isAlt: true,
		isCtrl: true,
		isMeta: true,
		isShift: false,
		key: "a",
	});
	expect(
		parseShortcut("")
	).toThrow();
	expect(
		parseShortcut("c")
	).toEqual({
		isAlt: false,
		isCtrl: false,
		isMeta: false,
		isShift: false,
		key: "c",
	});
	})
});
