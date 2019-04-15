/** @format */

import Node from "dom/Node";

export default class TextNode extends Node {
  /**
   * Constructs a new text node.
   * @param {?string} content Node's internal content.
   * @param {?Map} attrs Attribute map.
   */
  constructor(content = "", attrs = new Map()) {
    super(attrs);

    /**
     * Text node's internal content.
     * @type {string}
     * @private
     */
    this._content = content;
  }

  /**
   * TODO Could an empty text node therefore be inaccessible in editor?
   * @overide
   */
  get offsetSize() {
    return this._content.length;
  }
}
