/** @format */

import { combineReducers } from "redux";
import commands from "./commands";
import caretPosition from "./caretPosition";

export default combineReducers({
  commands,
  caretPosition,
});
