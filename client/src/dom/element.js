/**
 * @format
 */

import Node from "dom/node";
import NodeList from "dom/nodelist";

/**
 * An abstract {@link Node} that has children.
 */
export default class Element extends Node {
  /**
   * Constructs a new element.
   * @abstract
   * @param {Map} attrs Element attributes.
   * @param {...Node} children Child nodes.
   */
  constructor(attrs, ...children) {
    // Ensure element is not constructed directly
    if (new.target === Element) {
      throw new TypeError("Cannot construct abstract instance (Element) directly");
    }
    
    super(attrs);

    /**
     * A list of child nodes.
     * @type {NodeList}
     * @private
     */
    this._children = new NodeList(children);
  }

  /**
   * Returns an iterator over the element's children.
   * @return {Iterator}
   */
  children() {
    return this._children[ Symbol.iterator]();
  }
}
