/** @format */
import { combineReducers } from "redux";
import { ADD_DEFAULT_SHORTCUT } from "../actions/types";

export default combineReducers({
  allIds: allShortcuts,
  byId: shortcutsById,
});

function allShortcuts(state = [], action) {
  switch (action.type) {
    case ADD_DEFAULT_SHORTCUT:
      //checks if shortcut already exists
      if (state.includes(action.id)) {
        return state;
      }

      return [...state, action.id];

    default:
      return state;
  }
}

function shortcutsById(state = {}, action) {
  switch (action.type) {
    case ADD_DEFAULT_SHORTCUT:
      //checks if shortcut already exists
      if (Object.keys(state).includes(action.id)) {
        return state;
      }

      return {
        ...state,
        [action.id]: action.shortcuts,
      };

    default:
      return state;
  }
}
