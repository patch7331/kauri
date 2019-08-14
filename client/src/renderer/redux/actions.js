/** @format */
import { ADD_COMMAND, UPDATE } from "./actionTypes";

export const addCommand = (id, name, keys, behaviour) => ({
  type: ADD_COMMAND,
  payload: {
    id,
    name,
    keys,
    behaviour,
  },
});

export const updateCaretPos = ({ pos1, pos2 }) => ({
  type: UPDATE,
  payload: {
    pos1,
    pos2,
  },
});
