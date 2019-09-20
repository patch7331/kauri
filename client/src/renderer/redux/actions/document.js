/** @format */
import {
  UPDATE_CARET_POSITION,
  FETCH_DOC_ERROR,
  FETCH_DOC_REQUEST,
  FETCH_DOC_SUCCESS,
} from "./types";

export const fetchDocRequest = () => ({
  type: FETCH_DOC_REQUEST
});

export const fetchDocError = exception => ({
  type: FETCH_DOC_ERROR,
  exception
});

export const fetchDocSuccess = payload => ({
  type: FETCH_DOC_SUCCESS,
  payload,
  receivedAt: Date.now(),
});

export function fetchDoc(path) {
  return dispatch => {
    dispatch(fetchDocRequest());

    fetch("http://localhost:3000/load", {
      method: "POST",
      mode: "no-cors",
      body: path,
    })
      .then(response => response.json())
      .then(json => dispatch(fetchDocSuccess(json)))
      .catch(exception => dispatch(fetchDocError(exception)));
  };
}

export const updateCaretPos = ({ positionStart, positionEnd }) => ({
  type: UPDATE_CARET_POSITION,
  payload: {
    positionStart,
    positionEnd,
  },
});
