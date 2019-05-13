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
        var options = [];
        for (var i = 1; i <= 7; i++) {
            options.push(
                <option>{i}</option>
            );
        }
    return (
      <select class="toolbar__style-select" onchange={this._handleChange}>
        <option value="" selected>
          [Font size (1-7)]
        </option>
        {options}
      </select>
    );
  }
}
