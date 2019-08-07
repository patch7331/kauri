/** @format */

import { ADD_COMMAND } from "../actionTypes";

const initialState = {
  allIds: [],
  byIds: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_COMMAND:
      const { ID, name, keys, behaviour } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, id],
        byIds: {
          ...state.byIds,
          [id]: {
            id,
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
