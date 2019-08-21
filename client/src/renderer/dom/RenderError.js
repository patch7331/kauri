/** @format */

import ExtendableError from "util/ExtendableError";

/**
 * An error that can be thrown whilst rendering a node.
 */
export default class RenderError extends ExtendableError {
  /**
   * Constructs a new render error.
   * @param {string} message Error message.
   */
  constructor(message) {
    super(`Failed to render node: ${message}.`);
  }
}
