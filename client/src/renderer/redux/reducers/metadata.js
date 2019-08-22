/** @format */

import { SET_METADATA } from "../actionTypes";

const initialState = {};

const metadataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_METADATA:
      return {
        ...state,
        [action.key]: action.data,
      };
    default:
      return state;
  }
};

export default metadataReducer;
