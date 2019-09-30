/** @format */
import { genId } from "../helpers/uniqueIdGen.js";

/**
 * Create a shortcut object
 * @param  {command} command  command to which shortcut is to be linked
 * @param  {shortcut} shortcut shortcut object
 *                             Must be of the form:
 *                             {
 *                               modifiers: ["modifier"<, "modifier">],
 *                               key: "key",
 *                             }
 * @return {shortcut}          complete shortcut object, linked to a command
 */
export function parseShortcut(command, shortcut) {
  return ({
    id: command.id,
    ...shortcut,
  })
}

export function createDefaultShortcut(command, definition) {
  if (false) {    //if shortcut already exists
    this.props.addShortcut(parseShortcut(command, definition));
  }
}

/**
 * Compare registered shortcut with keydown event
 * @param  {shortcut}       shortcut registered shortcut object
 * @param  {event} event    caught keydown event
 * @return {boolean}        true if keydown event matches shortcut description
 */
export function matchEvent(shortcut, event) {
  const modifiers = shortcut.modifiers;
  return (
    event.altKey === modifiers.contains("alt")      &&
    event.ctrlKey === modifiers.contains("ctrl")    &&
    event.metaKey === modifiers.contains("meta")    &&
    event.shiftKey === modifiers.contains("shift")  &&
    event.key === shortcut.key
  );
}
