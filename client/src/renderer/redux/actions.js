/** @format */
import {
  ADD_COMMAND,
  UPDATE_CARET_POSITION,
  SET_METADATA,
  ADD_SHORTCUT,
} from "./actionTypes";

export const addCommand = (command) => ({
  type: ADD_COMMAND,
  payload: command.toObj()
});

export const addShortcut = (command) => ({
  type: ADD_SHORTCUT,
  payload: command.toObj()
});

export const updateCaretPos = ({ positionStart, positionEnd }) => ({
  type: UPDATE_CARET_POSITION,
  payload: {
    positionStart,
    positionEnd,
  },
});

export const setMetadata = (key, data) => ({
  type: SET_METADATA,
  key,
  data,
});
