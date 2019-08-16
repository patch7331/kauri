/** @format */

import { combineReducers } from "redux";
import caretPosition from "./caretPosition";
import commands from "./commands";
import document from "./document";

export default combineReducers({ caretPosition, commands, document });
