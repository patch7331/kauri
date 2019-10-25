/** @format */

import { ADD_COMMAND } from "./types";

export const addCommand = (id, name, callback) => ({
  type: ADD_COMMAND,
  id,
  name,
  callback,
});
