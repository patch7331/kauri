/** @format */

import { ADD_DEFAULT_SHORTCUT } from "./types";

export const addDefaultShortcut = (id, ...shortcuts) => ({
  type: ADD_DEFAULT_SHORTCUT,
  id,
  shortcuts,
});
