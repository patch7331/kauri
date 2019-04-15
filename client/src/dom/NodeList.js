/** @format */

import Node from "dom/Node";

/**
 * A highly accessible list of {@link Node}s.
 */
export default class NodeList {
  /**
   * Constructs a new node list.
   * @param {...Node} nodes A collection of nodes to seed the list with.
   */
  constructor(...nodes) {
    /**
     * An internal array of nodes.
     * @type {Node[]}
     * @private
     */
    this._nodes = nodes;
  }

  /**
   * Returns an iterator over each of the {@link Node}s.
   * @return {Iterator}
   */
  [Symbol.iterator]() {
    return this._nodes[Symbol.iterator]();
  }

  /**
   * Number of {@link Node}s within this node list.
   * @return {number}
   */
  get length() {
    this._nodes.length;
  }
}
