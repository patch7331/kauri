/** @format */

/**
 * An extendable error message, which provides some quality of life improvements
 * over the vanilla JavaScript error object.
 */
export default class ExtendableError extends Error {
  /**
   * Constructs a new extendable error. Should not be called directly.
   * @param {string} message Error message.
   * @abstract
   */
  constructor(message) {
    // Ensure constructor is not called directly
    if (new.target === ExtendableError) {
      throw new TypeError(
        "Cannot construct abstract instance (ExtendableError) directly.",
      );
    }

    super(message);
    this.name = this.constructor.name;

    // Push to stack trace
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
