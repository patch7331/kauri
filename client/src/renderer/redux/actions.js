/** @format */
import { ADD_COMMAND, UPDATE_CARET_POSITION } from "./actionTypes";

export const addCommand = (id, name, keys, behaviour) => ({
  type: ADD_COMMAND,
  payload: {
    id,
    name,
    keys,
    behaviour,
  },
});

export const updateCaretPos = ({ startPosition, endPosition }) => ({
  type: UPDATE_CARET_POSITION,
  payload: {
    startPosition,
    endPosition,
  },
});
