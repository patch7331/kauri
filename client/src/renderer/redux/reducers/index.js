/** @format */

import { combineReducers } from "redux";
import commands from "./commands";
import document from "./document";
import metadata from "./metadata";

export default combineReducers({ commands, document, metadata });
