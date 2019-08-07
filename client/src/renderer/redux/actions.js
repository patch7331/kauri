/** @format */
import { ADD_COMMAND } from "./actionTypes";

export const addCommand = (id, name, keys, behaviour) => ({
  type: ADD_COMMAND,
  payload: {
    id,
    name,
    keys,
    behaviour,
  },
});
