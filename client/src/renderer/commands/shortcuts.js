/** @format */
import { addShortcut } from "redux/actions";
import * as fs from "fs";

/**
 * Get contents of keybinds.JSON
 * @return {Promise} data extracted from file, parsed as:
 * {
 *   id: {shortcut},
 *   id: {shortcut},
 *   ...
 * }
 */
export function readJSON() {
  return new Promise((resolve, reject) => {
    fs.readFile("./src/renderer/commands/keybinds.json", (err, data) => {
      if (err) throw reject(err);
      resolve(parseBindings(JSON.parse(data)));
    });
  });
}

/**
 * Parse keybinds into an array of shortcuts
 * @param  {JSON}   keybinds  keybinds, parsed from keybinds.JSON
 * @return {Array}            shortcuts, extracted from keybinds object
 */
export function parseBindings(keybinds) {
  const parsed = {};
  const addBinding = (id, binding) => parsed[id] = binding;

  parseBindingsRecursively(keybinds, addBinding);
  return parsed;
}

/**
 * Recursively traverse keybinds, extracting shortcut objects
 * @param  {Object}     obj        parsed JSON
 * @param  {function(id: string, binding: Object)} addBinding
 *                                 callback function, add binding to array of shortcuts
 * @param  {string[]}   path       ordered list of namespaces of shortcut
 *                                   e.g. ["clipboard", "copy"]
 */
function parseBindingsRecursively(obj, addBinding, path = []) {
  Object.keys(obj).forEach(key => {
    const value = obj[key];

    //recurse if value is not an array (i.e. value is a namespace or name)
    if (value.constructor === Object) {
      parseBindingsRecursively(value, addBinding, [...path, key]);
      return;
    }

    const id = [...path, key].join(".");
    addBinding(id, value);
  });
}
