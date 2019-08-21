/** @format */

import { combineReducers } from "redux";
import caretPosition from "./caretPosition";
import commands from "./commands";
import document from "./document";
import metadata from "./metadata";

export default combineReducers({ caretPosition, commands, document, metadata });
