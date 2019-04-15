/** @format */

import Element from "dom/Element";

export default class HeadingElement extends Element {
  /**
   * Constructs a new heading element.
   * @param {?number} level Heading level. From 1..6.
   * @param {...Node} children Child nodes.
   */
  constructor(level = 1, ...children) {
    super(new Map(), children);

    /**
     * Heading level.
     * @type {number} From 1..6
     */
    this.level = level;
  }
}
