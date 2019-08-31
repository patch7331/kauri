/** @format */
import {
  UPDATE_CARET_POSITION,
  FETCH_DOC_ERROR,
  FETCH_DOC_REQUEST,
  FETCH_DOC_SUCCESS,
} from "./types";

export function fetchDocRequest() {
  return { type: FETCH_DOC_REQUEST };
}

export function fetchDocError(exception) {
  return { type: FETCH_DOC_ERROR, exception };
}

export function fetchDocSuccess(payload) {
  return { type: FETCH_DOC_SUCCESS, payload };
}

export function fetchDoc(path) {
  return dispatch => {
    dispatch(fetchDocRequest());

    fetch(path)
      .then(response => response.json())
      .then(json =>
        dispatch(fetchDocSuccess(json)).catch(exception =>
          dispatch(fetchDocError(exception)),
        ),
      );
  };
}

export const updateCaretPos = ({ positionStart, positionEnd }) => ({
  type: UPDATE_CARET_POSITION,
  payload: {
    positionStart,
    positionEnd,
  },
});
