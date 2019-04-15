/** @format */

import Node from "dom/node";
import Element from "dom/element";

/**
 * A standard Document Object Model implementation.
 * @see Node
 */
export class Dom {
  constructor() {
    this.root = new DocumentNode();
  }

  appendChild(node) {
    this.root.children.push(node);
  }
}

export class DocumentNode extends Node {
  constructor(children = []) {
    super();
    this.children = children;
  }
}

export class TextNode extends Node {
  constructor(content = null) {
    super();
    this.content = content;
    this.styles = {};
  }
}

export class HeadingElement extends Element {
  constructor(child = undefined) {
    if (typeof child === "string") {
      super([new TextNode(child)]);
    } else {
      super(child);
    }
  }
}

export class ParagraphElement extends Element {
  constructor(child = undefined) {
    if (typeof child === "string") {
      super([new TextNode(child)]);
    } else {
      super(child);
    }
  }
}
