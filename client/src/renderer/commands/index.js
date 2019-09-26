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
 *       shortcuts: [],
 *       callback: Clipboard.doCopy,
 *     }
 */
export function createCommand(id, name, callback) {
  return {
    id,
    name,
    shortcuts: [],
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
  const keybinds;
  fs.readFileSync("./src/renderer/commands/keybinds.json", (err, data) => {
    if (err) throw err;
    console.log(data);
    //keybinds = JSON.parse(data);
    //console.log(keybinds);
  });
  //console.log(keybinds);
  return "hello";
  //keybinds["clipboard"].forEach(copy => console.log(copy));
  //return keybinds["clipboard"]["paste"];
}
