/** @format */

import { h, Component } from "preact";

/**
 * A component for changing the font size of currently selected elements.
 * @return {PreactElement} A rendered font size selector element.
 */
export default class FontSizeSelector extends Component {
  /**
   * An event handler for the internal select element.
   * @private
   */
  _handleChange(event) {
    const { target } = event;
    document.execCommand("fontSize", false, target.value);
    target.value = "";
  }

  render() {
    const options = [1, 2, 3, 4, 5, 6, 7];
    return (
      <select class="toolbar__style-select" onchange={this._handleChange}>
        <option value="" selected>
          [Font size (1-7)]
        </option>
        {options.map(size => (
          <option>{size}</option>
        ))}
      </select>
    );
  }
}
