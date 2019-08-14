/** @format */

import { UPDATE_CARET_POSITION } from "../actionTypes";

const initialState = {
  pos1: 0,
  pos2: 0,
};

const caretReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case UPDATE_CARET_POSITION:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default caretReducer;
