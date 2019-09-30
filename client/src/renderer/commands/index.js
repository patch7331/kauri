/** @format */
import createShortcut from "./shortcuts.js";
import * as fs from "fs";

/**
 * Construct a new command object
 * @param  {string}   id       command ID
 *                             must be of the form "namespace:name"
 * @param  {string}   name     command name
 * @param  {Function} callback function to be called when command is executed
 * @return {command}           command object
 *
 * @example
 *     createCommand("Clipboard:Copy", "Copy", Clipboard.doCopy)
 *     will return {
 *       id: "Clipboard:Copy"
 *       name: "Copy",
 *       callback: Clipboard.doCopy,
 *     }
 */
export default function createCommand(id, name, callback) {
  return {
    id,
    name,
    callback,
  };
}

/**
 * get contents of JSON
 *   open filestream
 *   get file contents
 *   put file contents into string
 *   JSON.parse string into object
 * search store for commands matching namespace:name
 * for each namespace:name
 *   get shortcut
 *   pass shortcut to relevand command
 */
export function getJSON() {
  return new Promise((resolve, reject) => {
    fs.readFile("./src/renderer/commands/keybinds.json", (err, data) => {
      if (err) throw reject(err);
      const keybinds = JSON.parse(data);
      resolve(keybinds["clipboard"]["paste"]);
    });
  });
}
