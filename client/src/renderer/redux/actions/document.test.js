/** @format */

import * as actions from "./document";
import * as types from "./types";

describe("fetchDocRequest", () => {
  it("should return the document request action", () => {
    const expectedAction = { type: types.FETCH_DOC_REQUEST };
    expect(actions.fetchDocRequest()).toEqual(expectedAction);
  });
});

describe("fetchDocError", () => {
  it("should return document error action and exception message", () => {
    const exception = "error";
    const expectedAction = { type: types.FETCH_DOC_ERROR, exception };
    expect(actions.fetchDocError(exception)).toEqual(expectedAction);
  });
});

describe("fetchDocSuccess", () => {
  it("should return document fetch success action + payload", () => {
    const payload = "json";
    const expectedAction = { type: types.FETCH_DOC_SUCCESS, payload };
    expect(actions.fetchDocSuccess(payload)).toEqual(expectedAction);
  });
});

//fetchDoc test

describe("updateCaretPos", () => {
  it("should return update caret action + 2 positions", () => {
    const payload = { positionStart: 0, positionEnd: 5 };
    const expectedAction = { type: types.UPDATE_CARET_POSITION, payload };
    expect(actions.updateCaretPos(payload)).toEqual(expectedAction);
  });
});
