/** @format */

import { h, Component } from "preact";

/**
 * A component for changing the color of currently selected text.
 * @return {PreactElement} A rendered style selector element.
 */
export default class FontColorSelector extends Component {
  /**
   * Changes the selected text's font color.
   * @private
   */
  _handleChange(event) {
    const { target } = event;
    document.execCommand("foreColor", false, target.value);
  }

  render() {
    return <input type="color" onChange={this._handleChange} />;
  }
}
