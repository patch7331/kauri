/** @format */

import debugDocument from "./test.json";
import {
  MOVE_SELECTION,
  FETCH_DOCUMENT_REQUEST,
  FETCH_DOCUMENT_SUCCESS,
  FETCH_DOCUMENT_ERROR,
  ADD_TEXT,
} from "../actions/types";
import { Status } from "../actions";
import { translateKDF } from "helpers/translateKDF";

const initialState = {
  status: Status.SUCCESS,
  content: translateKDF(debugDocument),
};

/**
 * A reducer for document content.
 * @param {object} state Current state.
 * @param {object} action Action to perform.
 */
export default function documentReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DOCUMENT_REQUEST:
      return {
        ...state,
        status: Status.LOADING,
      };

    case FETCH_DOCUMENT_SUCCESS:
      return {
        ...state,
        status: Status.SUCCESS,
        content: translateKDF(action.payload.content),
        lastUpdated: action.receivedAt,
      };

    case FETCH_DOCUMENT_ERROR:
      return {
        ...state,
        status: Status.ERROR,
        exception: action.exception,
      };

    case MOVE_SELECTION:
      return {
        ...state,
        selection: selectionReducer(state.selection, action),
      };

    case ADD_TEXT:
      return {
        ...state,
        selection: selectionReducer(state.selection, action),
        content: contentReducer(state.content, action),
      };

    default:
      return state;
  }
}

/**
 * A reducer for document selection.
 * @param {object} state Current state.
 * @param {object} action Action to perform on state.
 */
export function selectionReducer(
  state = { startPos: 0, endPos: 0, startId: 0, endId: 0 },
  action,
) {
  switch (action.type) {
    case MOVE_SELECTION:
      return {
        ...state,
        startPos: action.startPos,
        endPos: action.endPos,
        startId: action.startId,
        endId: action.endId,
      };
    case ADD_TEXT:
      const pos = action.position + action.text.length;
      return {
        ...state,
        startPos: pos,
        endPos: pos,
        startId: action.id,
        endId: action.id,
      };
    default:
      return state;
  }
}

export function contentReducer(state, action) {
  switch (action.type) {
    case ADD_TEXT:
      const key = action.id;
      return {
        ...state,
        byId: {
          ...state.byId,
          [key]: {
            ...state.byId[key],
            content:
              state.byId[key].content.substring(0, action.position) +
              action.text +
              state.byId[key].content.substring(action.position),
          },
        },
      };

    case CREATE_NODE:

    default:
      return state;
  }
}
