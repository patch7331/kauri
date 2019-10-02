/** @format */

import { ADD_DEFAULT_SHORTCUT } from "./types";

export const ADD_DEFAULT_SHORTCUT = (id, shortcuts = []) => ({
  type: ADD_DEFAULT_SHORTCUT,
  id,
  shortcuts,
});
