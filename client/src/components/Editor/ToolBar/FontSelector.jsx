/** @format */

import { h, Component } from "preact";
import { ipcRenderer } from "electron";

/**
 * A component for changing the font name of currently selected elements.
 * @return {PreactElement} A rendered font selector element.
 */
export default class FontSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { fontList: [] };
    ipcRenderer.send("getFontList");
    ipcRenderer.on("fontList", (event, args) => {
      this.setState({ fontList: args });
    });
  }

  /**
   * An event handler for the internal select element.
   * @private
   */
  _handleChange(event) {
    const { target } = event;
    document.execCommand("fontName", false, `${target.value}`);
    target.value = "";
  }

  render() {
    var options = [];
    for (var i = 0; i < this.state.fontList.length; i++) {
      options.push(
        <option value={this.state.fontList[i]}>{this.state.fontList[i]}</option>
      );
    }
    return (
      <select class="toolbar__style-select" onchange={this._handleChange}>
        <option value="" selected>
          [Font]
        </option>
        {options}
      </select>
    );
  }
}
