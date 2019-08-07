/** @format */

import { ADDCOMMAND } from "../actionTypes";

const initialState = {
  allIds: [],
  byIDs: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADDCOMMAND:
      const { ID, name, keys, behaviour } = action.payload;
      return {
        ...state,
        allIDs: [...state.allIDs, ID],
        byIDs: {
          ...state.byIDs,
          [ID]: {
            ID,
            name,
            keys,
            behaviour,
          },
        },
      };
    default:
      return state;
  }
}
