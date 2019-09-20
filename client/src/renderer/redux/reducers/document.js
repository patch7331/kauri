/** @format */

import test from "./test.json";
import {
  UPDATE_CARET_POSITION,
  FETCH_DOC_REQUEST,
  FETCH_DOC_SUCCESS,
  FETCH_DOC_ERROR,
} from "../actions/types";
import { Status } from "../actions";

const initialState = {
  status: Status.SUCCESS,
  selection: {
    start: 0,
    end: 0,
  },
  content: translate(test),
};

export default function documentReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DOC_REQUEST:
      return {
        ...state,
        status: Status.LOADING,
      };

    case FETCH_DOC_SUCCESS:
      return {
        ...state,
        status: Status.SUCCESS,
        content: translate(action.payload.content),
        lastUpdated: action.receivedAt,
      };

    case FETCH_DOC_ERROR:
      return {
        ...state,
        status: Status.ERROR,
        exception: action.exception,
      };

    default:
      return state;
  }
}

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
