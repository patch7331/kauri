/** @format */

import NodeList from "dom/NodeList";

export default class Document {
  constructor(...children) {
    this.children = new NodeList(children);
  }
}
