/** @format */

import {} from "";

const initialState = {
  allIDs: [],
  byIDs: {},
};

export default function(state = initialState, action) {
  const {ID, name, keys, behaviour} = action.payload;
  return {
    ...state,
    allIDs: [...state.allIDs, id],
    byIDs: {
      ...state.byIDs,
      [ID]: {
        ID,
        name,
        keys,
        behaviour
      }
    }
  }