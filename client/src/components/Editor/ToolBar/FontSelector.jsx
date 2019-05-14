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
  }

  componentDidMount() {
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

  render(props, state) {
    return (
      <select class="toolbar__style-select" onchange={this._handleChange}>
        <option value="" selected>
          [Font]
        </option>
        {state.fontList.map(font => (
          <option>{font}</option>
        ))}
      </select>
    );
  }
}
