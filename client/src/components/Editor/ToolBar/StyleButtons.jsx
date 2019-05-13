/** @format */

import { h, Component } from "preact";

/**
 * A component for adding some styling (bold, italic, underline) to currently selected text.
 * @return {PreactElement} A rendered style buttons element.
 */
export default class StyleButtons extends Component {
  /**
   * Toggles bold on/off for the selection or at the insertion point.
   * @private
   */
  _handleBold(event) {
    document.execCommand("bold", false, null);
  }

  /**
   * Toggles bold on/off for the selection or at the insertion point.
   * @private
   */
  _handleItalic(event) {
    document.execCommand("italic", false, null);
  }

  /**
   * Toggles bold on/off for the selection or at the insertion point.
   * @private
   */
  _handleUnderline(event) {
    document.execCommand("underline", false, null);
  }

  render() {
    return (
      <div>
        <button onClick={this._handleBold}>Bold</button>
        <button onClick={this._handleItalic}>Italic</button>
        <button onClick={this._handleUnderline}>Underline</button>
      </div>
    );
  }
}
