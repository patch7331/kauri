/** @format */
import createShortcut from "./shortcuts.js";

export function createCommand(id, name, callback) {
  return {
    shortcuts: [],
    id,
    name,
    callback,
  };
}

export function addShortcut(command, definition) {
  command.shortcuts.push(createShortcut(definition));
}
