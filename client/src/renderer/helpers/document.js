import store from "redux/store";

function rebuildNode(node, content) {
  if (!node.hasOwnProperty("children")) {
    delete node.id;
    return node;
  }

  delete node.id;
  node.children = node.children.map(id => rebuildNode(content.byId[id], content))
  return node
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
    }
  };
  console.log(body);

  fetch("http://localhost:3000/save", {
    method: "POST",
    body: JSON.stringify(body), 
  }).then(console.log).catch(console.error);
}