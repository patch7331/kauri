import { UPDATE } from "../actionTypes";

const initialState = {
	pos1: 0,
	pos2: 0
}

const caretReducer = (state = initialState, action) => {
	console.log(action);
	switch(action.type){
		case UPDATE:
			return {
				...state,
				pos1: action.payload.pos1,
				pos2: action.payload.pos2
			}
		default:
			return state
	}
}
export default caretReducer;