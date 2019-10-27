/** @format */

import store from "redux/store";

/**
 * Takes a node from the KDF store, and makes it a valid KDF node for the server
 * 
 * This process involves adding any children back into the node, and removing
 * any added attributes, such as a node ID.
 * 
 * @param {Object} node A KDF node from the redux store.
 * @param {Object} content Document content from the redux store.
 */
function rebuildNode(node, content) {
  const clone = { ...node };

  if (clone.hasOwnProperty("children")) {
    clone.children = clone.children.map(id =>
      rebuildNode(content.byId[id], content),
    );
  }

  delete clone.id;
  return clone;
}

export function saveDocument(path) {
  const state = store.getState();
  const { content } = state.document;

  const body = {
    path,
    document: {
      content: content.allIds.map(id => rebuildNode(content.byId[id], content)),
      styles: {
        classes: state.styles,
        page: {},
      },
      meta: state.metadata,
    },
  };

  fetch("http://localhost:3000/save", {
    method: "POST",
    body: JSON.stringify(body),
  })
    .then(console.log)
    .catch(console.error);
}
