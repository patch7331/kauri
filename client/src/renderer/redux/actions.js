/** @format */
import { ADDCOMMAND } from "./actionTypes";

export const addCommand = (id, name, keys, behaviour) => ({
  type: ADDCOMMAND,
  payload: {
    ID,
    name,
    keys,
    behaviour,
  },
});
