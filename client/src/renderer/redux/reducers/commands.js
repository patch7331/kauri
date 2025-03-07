/** @format */
import { combineReducers } from "redux";
import { ADD_COMMAND } from "../actions/types";

export default combineReducers({
  allIds: allCommands,
  byId: commandsById,
});

function allCommands(state = [], action) {
  switch (action.type) {
    case ADD_COMMAND:
      return [...state, action.id];
    default:
      return state;
  }
}

function commandsById(state = {}, action) {
  switch (action.type) {
    case ADD_COMMAND:
      return {
        ...state,
        [action.id]: {
          id: action.id,
          name: action.name,
          callback: action.callback,
        },
      };
    default:
      return state;
  }
}
