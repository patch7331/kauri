/** @format */

import "./styles.scss";
import { Component, h } from "preact";
import clipboard from "electron-clipboard-extended";

/**
 * Stores and lists contents of system clipboard
 * @extends Component
 */

export default class Clipboard extends Component {
  constructor(props) {
    super(props);
    this.state = { clipboardStack: [] };
    this.handleTextChanged = this.handleTextChanged.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
  }

  componentDidMount() {
    clipboard.startWatching();
    clipboard.on("text-changed", this.handleTextChanged);
    clipboard.on("image-changed", this.handleImageChanged);
  }

  componentWillUnmount() {
    clipboard.stopWatching();
    clipboard.off("text-changed");
    clipboard.off("image-changed");v
  }

  handleTextChanged() {
    this.setState(prevState => {
      return {
        clipboardStack: [
          ...prevState.clipboardStack,
          new ClipboardItem("txt", clipboard.readText()),
        ],
      };
    });
  }

  handleImageChanged() {
    this.setState(prevState => {
      const img = clipboard.readImage();
      const imgURI = img.toDataURL();
      return {
        clipboardStack: [
          ...prevState.clipboardStack,
          new ClipboardItem("img", imgURI),
        ],
      };
    });
  }

  render(props, state) {
    return (
      <ul class="clipboard">
        {state.clipboardStack.map((item, index) => (
          <li class="clipboard__item" id={"cp_it_" + index}>
            <button onclick = {() => state.clipboardStack.splice(index, 1) && this.setState()}>X</button>
            {item.type === "txt" ? (
              <p>{item.data}</p>
            ) : (
              <img src={item.data} alt="image" />
            )}
          </li>
        ))}
      </ul>
    );
  }
}

class ClipboardItem {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
}
