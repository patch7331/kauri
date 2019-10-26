/** @format */

import { SET_PAGE_STYLES, FETCH_DOCUMENT_SUCCESS } from "../actions/types";

export default function pageStyles(state = {}, action) {
  switch (action.type) {
    case FETCH_DOCUMENT_SUCCESS:
      return action.payload.styles.page;

    case SET_PAGE_STYLES:
      return {
        ...state,
        [action.key]: action.value,
      };

    default:
      return state;
  }
}
