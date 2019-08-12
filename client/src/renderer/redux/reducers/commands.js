/** @format */
import { combineReducers } from "redux";
import { ADD_COMMAND } from "../actionTypes";

export default combineReducers({
  allIds: allCommands,
  byId: commandsById,
});

function allCommands(state = [], action) {
  switch (action.type) {
    case ADD_COMMAND:
      return [...state, action.payload.id];
    default:
      return state;
  }
}

function commandsById(state = {}, action) {
  switch (action.type) {
    case ADD_COMMAND:
      return {
        ...state,
        [action.payload.id]: { ...action.payload },
      };
    default:
      return state;
  }
}
