/** @format */
import {ADDCOMMAND} from "./actionTypes"

export const addCommand = (ID, name, keys, behaviour) => ({
	type: ADDCOMMAND,
	payload: {
		ID,
		name,
		keys,
		behaviour
	}
});