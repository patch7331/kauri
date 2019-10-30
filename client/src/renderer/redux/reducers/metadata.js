/** @format */

import { SET_METADATA, FETCH_DOCUMENT_SUCCESS } from "../actions/types";

const initialState = {};

const metadataReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DOCUMENT_SUCCESS:
      return action.payload.meta;

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
