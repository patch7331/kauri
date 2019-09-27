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
export function createCommand(id, name, callback) {
  return {
    id,
    name,
    callback,
  };
}

/**
 * Add a keyboard shortcut to an existing command
 * @param {command} command   registered command
 * @param {string} definition string description of keyboard shortcut
 *
 * @example
 *     addShortcut(Clipboard:Copy, "control+c")
 *     adds
 *     {
 *       "isAlt": false,
 *       "isCtrl": true,
 *       "isMeta": false,
 *       "isShift": false,
 *       "key": "c",
 *     }
 *     to the Clipboard:Copy command object's shortcuts array
 */
export function addShortcut(command, definition) {
  command.shortcuts.push(createShortcut(definition));
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
