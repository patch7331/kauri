/** @format */

import { SET_STYLES } from "../actions/types";

const initialState = {
  body: {
    display: "Body Text",
    styles: {
      fontFamily: "Inter, sans-serif",
      fontSize: "12pt",
      color: "#333",
      lineHeight: "1.4",
    },
  },
  h1: {
    display: "Heading 1",
    styles: {
      color: "#111",
      fontSize: "2em",
      lineHeight: "1",
      fontWeight: "600",
      padding: "4em 0 1em",
    },
  },
};

export default function styles(state = initialState, action) {
  switch (action.type) {
    case SET_STYLES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
