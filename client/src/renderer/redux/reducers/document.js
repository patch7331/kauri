/** @format */
import test from "./test.json";
import { UPDATE_CARET_POSITION } from "../actions/types";

const intialState = {
  selection: {
    start: 0,
    end: 0,
  },
  nodes: translate(test),
};

function translate(nodes) {
  let id = 0;
  const nextId = () => id++;
  const byId = {};
  const addToById = node => (byId[node.id] = node);
  const allIds = nodes.map(node => translateNode(node, nextId, addToById));
  return { byId, allIds };
}

function translateNode(node, nextId, addToById) {
  if (typeof node === "string") {
    node = {
      type: "text",
      content: node,
    };
  }
  node.id = nextId();
  if (node.children) {
    node.children = node.children.map(node =>
      translateNode(node, nextId, addToById),
    );
  }
  addToById(node);
  return node.id;
}

export function caretReducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case UPDATE_CARET_POSITION:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default (state = intialState, action) => state;
