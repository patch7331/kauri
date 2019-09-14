/** @format */

import { combineReducers } from "redux";

import cache from "./cache";
import commands from "./commands";
import document from "./document";
import metadata from "./metadata";

export default combineReducers({ cache, commands, document, metadata });
