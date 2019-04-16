/** @format */

import NodeList from "dom/NodeList";

export default class Document {
  constructor(...children) {
    this._children = new NodeList(children);
  }

  /**
   * Returns an iterator over the document's children.
   * @return {Iterator}
   */
  get children() {
    return this._children[Symbol.iterator]();
  }
}
