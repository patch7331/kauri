/** @format */

import { combineReducers } from "redux";
import commands from "./commands";
import caretReducer from './caretPosition';


export default combineReducers({
	commands,
	caretReducer});
