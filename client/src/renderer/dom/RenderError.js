/** @format */

import ExtendableError from "util/ExtendableError";

/**
 * An error that can be thrown whilst rendering a node.
 */
export default class RenderError extends ExtendableError {
  /**
   * Constructs a new render error.
   * @param {Object} node Node that failed to render for any reason.
   * @param {string} message Error message.
   */
  constructor(node, message) {
    super(`Failed to render node: ${message}\n${node}.`);
  }
}
