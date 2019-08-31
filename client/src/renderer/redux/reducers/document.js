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

/**
 * Translate KDF nodes into Redux ready objects
 * Recursively traverses json tree, storing them in an array after
 * they have been assigned an ID
 * @param {Object[]} nodes An array of KDF nodes.
 */
function translate(nodes) {
  let id = 0;
  const byId = {};

  // Recursive callbacks
  const nextId = () => id++;
  const addToById = node => (byId[node.id] = node);
  const allIds = nodes.map(node => translateNode(node, nextId, addToById));
  return { byId, allIds };
}

/**
 * Translate a KDF node into a Redux ready object
 * Flattens nodes and assigns them IDs, recursively travels to
 * child nodes
 * @param {Object} node
 * @param {function(): number} nextId A callback to generate a new id.
 * @param {function(node: Object)} addToById Adds nodes to byID map
 */
function translateNode(node, nextId, addToById) {
  //Handles text shorthand
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
