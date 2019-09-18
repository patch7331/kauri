/** @format */
import { genId } from "./uniqueIdGen";

export default class Command {
  constructor(id, name, callback) {
    this.shortcuts = [];
    this.id = id;
    this.name = name;
    this.callback = callback;
  }

  /**
   * @param {object} definition keyboard shortcut object (made with parseShortcut)
   * @param {string} definition string describing keyboard shortcut, to be parsed
   */
  createShortcut(definition) {
    if (typeof definition === "string") {
      definition = this.parseShortcut(definition);
    }

    this.shortcuts.push({
      id: genId(),
      isAlt: false,
      isCtrl: false,
      isMeta: false,
      isShift: false,
      ...definition,
    });
  }

  /**
   * Parse string into shortcut object
   * @param {string} str string describing shortcut
   *                        Must be of the form "modifier[+modifier]+key"
   *                        No spaces, key at end, modifiers in any order
   *                        Must not be empty
   * @return {object} keyboard shortcut object
   */
  parseShortcut(str) {
    if (str === "") throw "Cannot create an empty shortcut";
    const shortcut = {};
    const modifiers = str.toLowerCase().split("+");

    shortcut["isAlt"] = modifiers.includes("alt");
    shortcut["isCtrl"] = modifiers.includes("control");
    shortcut["isMeta"] = modifiers.includes("meta");
    shortcut["isShift"] = modifiers.includes("shift");
    shortcut["key"] = modifiers[modifiers.length - 1];

    return shortcut;
  }

  /**
   * @return {object} command object
   */
  toObj = () => ({
    id: this.id,
    name: this.name,
    shortcuts: this.shortcuts,
    callback: this.callback,
  });
}
