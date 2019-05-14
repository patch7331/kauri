/** @format */

import { h, Component } from "preact";

/**
 * A component for changing the appearance of currently selected elements.
 * @return {PreactElement} A rendered style selector element.
 */
export default class StyleSelector extends Component {
  /**
   * An event handler for the internal select element.
   * @private
   */
  _handleChange(event) {
    const { target } = event;
    document.execCommand("formatBlock", false, `<${target.value}>`);
    target.value = "";
  }

  render() {
    return (
      <select class="toolbar__style-select" onchange={this._handleChange}>
        <option value="" selected>
          [Style]
        </option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
        <option value="p">Normal Text</option>
      </select>
    );
  }
}
