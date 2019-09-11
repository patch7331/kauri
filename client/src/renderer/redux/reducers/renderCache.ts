/** @format */

import { combineReducers } from "redux";

export default combineReducers({ nodesById, workingArea });

export function nodesById(state: {} = {}, action: { type: string }) {
  switch (action.type) {
    default:
      return state;
  }
}

export function workingArea(state: {} = {}, action: { type: string }) {
  switch (action.type) {
    default:
      return state;
  }
}
