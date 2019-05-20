/** @format */

import "./styles.scss";
import { Component, h } from 'preact';
import clipboard from "electron-clipboard-extended";

export default class Clipboard extends Component {
  constructor(props) {
    super(props);
    this.state = { clipboardStack: [] };
  }

  componentDidMount() {
    clipboard.startWatching();
    clipboard.on("text-changed", () => {
      this.setState(prevState => {
        const text = clipboard.readText();
        return {
          clipboardStack: [
            ...prevState.clipboardStack,
            new ClipboardItem("txt", text),
          ],
        };
      });
    });
    clipboard.on("image-changed", () => {
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
    });
  }
  componentWillUnmount() {
    clipboard.stopWatching();
    clipboard.off("text-changed");
  }
  render(props, state) {
    return (
      <ul class="cpList">
        {state.clipboardStack.map(item => (
          <li>
            {" "}
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
