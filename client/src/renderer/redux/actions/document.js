/** @format */

import {
  FETCH_DOCUMENT_ERROR,
  FETCH_DOCUMENT_REQUEST,
  FETCH_DOCUMENT_SUCCESS,
  MOVE_SELECTION,
  ADD_TEXT,
  CREATE_NODE,
  DELETE_TEXT_END,
  DELETE_TEXT,
} from "./types";
import { Status } from "./index";

/**
 * An action creator which handles a new fetch request.
 */
export const fetchDocumentRequest = () => ({
  type: FETCH_DOCUMENT_REQUEST,
});

/**
 * An action creator which handles a failed document fetch.
 * @param {object} exception Fetch exception.
 */
export const fetchDocumentError = exception => ({
  type: FETCH_DOCUMENT_ERROR,
  exception,
});

/**
 * An action creator which handles a successful document fetch.
 * @param {object} payload JSON payload from server.
 */
export const fetchDocumentSuccess = payload => ({
  type: FETCH_DOCUMENT_SUCCESS,
  payload,
  receivedAt: Date.now(),
});

/**
 * Fetch a parsed document from the file system.
 * @param {string} path Path to document.
 */
export function fetchDocument(path) {
  return dispatch => {
    dispatch(fetchDocumentRequest());

    fetch("http://localhost:3000/load", {
      method: "POST",
      body: path,
    })
      .then(response => response.json())
      .then(json => dispatch(fetchDocumentSuccess(json)))
      .catch(exception => dispatch(fetchDocumentError(exception)));
  };
}

/**
 * Whether a fetch action should be performed.
 * @param {object} state Current store state.
 */
export function shouldFetchDocument(state) {
  return state.document.status !== Status.LOADING;
}

/**
 * Fetch the document at the given path, but only if currently possible.
 * @param {string} path Path to document.
 */
export function fetchDocumentIfShould(path) {
  return (dispatch, getState) => {
    if (shouldFetchDocument(getState())) {
      return dispatch(fetchDocument(path));
    }

    return Promise.resolve();
  };
}

/**
 * Move the current document selection position.
 * @param {number} start Start position.
 * @param {number} end End position.
 */
export const moveSelection = (startPos, endPos, startId, endId) => ({
  type: MOVE_SELECTION,
  startPos,
  endPos,
  startId,
  endId,
});

//Update content in store?
export const addText = (id, position, text) => ({
  type: ADD_TEXT,
  id,
  position,
  text,
});

export const deleteText = (id, position) => ({
  type: DELETE_TEXT,
  id,
  position,
});

export const deleteTextEnd = (id, position) => ({
  type: DELETE_TEXT_END,
  id,
  position,
});

export const createNode = (type, prevNodeId) => ({
  type: CREATE_NODE,
  type,
  prevNodeId,
});
