/**
 * @format
 */

/**
 * An abstract {@link DOM} Node.
 */
export default class Node {
  /**
   * Constructs a new node.
   *
   * This is an abstract class, and therefore cannot be constructed directly.
   * @abstract
   * @param {Map} attrs Node's attributes.
   */
  constructor(attrs) {
    // Enforce abstract nature of Node
    if (new.target === Node) {
      throw new TypeError("Cannot construct abstract instance (Node) directly");
    }

    this.parent = null;

    /**
     * Node attribute map.
     * @type {Map}
     * @private
     */
    this._attrs = attrs;
  }

  /**
   * Determines this node's index within the parent node.
   * @return {?number}
   */
  get index() {
    // Ensure parent is defined
    if (!this.parent) {
      return null;
    }

    return this.parent.getChildIndex(this);
  }

  /**
   * Retrieves the immediately adjacent sibling node or null.
   * @return {?Node}
   */
  get nextSibling() {
    return this.parent.getChild(this.index + 1);
  }

  /**
   * Retrieves the immediately previous sibling node or null.
   * @return {?Node}
   */
  get previousSibling() {
    return this.parent.getChild(this.index - 1);
  }

  /**
   * Determines whether the given attribute is defined.
   * @param {string} key Map key.
   * @return {boolean} Whether the key is defined.
   */
  hasAttribute(key) {
    return this._attrs.has(key);
  }

  /**
   * Gets the value of the given key.
   * @param {string} key Map key.
   * @return {?Object} value Value at key.
   */
  getAttribute(key) {
    return this._attrs.get(key);
  }

  /**
   * Sets a key value pair in the attribute map.
   * @param {string} key Map key.
   * @param {Object} value Value to set for key.
   */
  setAttribute(key, value) {
    this._attrs.set(key, value);
  }

  /**
   * Retrieves an iterator over the attribute keys.
   * @return {Iterator}
   */
  getAttributeKeys() {
    return this._attrs.keys();
  }

  /**
   * Retrieves an iterator over the attribute values.
   * @return {Iterator}
   */
  getAttributeValues() {
    return this._attrs.values();
  }
}
