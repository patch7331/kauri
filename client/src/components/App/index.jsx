/** @format */

import "./styles.scss";
import demo from "./demo.json";
import { h, Component, createRef } from "preact";
import Editor from "components/Editor";
import Header from "components/Header";
import { remote } from "electron";

const POST_URI_OPEN_FILE = "http://127.0.0.1:3000/load";

export default class App extends Component {
  /**
   * Constructs a new app component.
   * @param {Object} props Component properties.
   */
  constructor(props) {
    super(props);
    this.state = { document: demo.document };
    this.loadFile = this.loadFile.bind(this);
    this.editor = createRef();
  }

  /**
   * Opens a file selection dialog, sends the file path to the server, then parse the server's response and use it as the new state.
   */
  loadFile() {
    var filePath = remote.dialog.showOpenDialog({
      properties: ["openFile"],
    });
    fetch(POST_URI_OPEN_FILE, { method: "POST", body: filePath[0] })
      .then(resp => {
        return resp.json();
      })
      .then(json => {
        this.editor.current.clearContentEditable();
        this.setState(json);
      })
      .catch(e => console.log(e));
  }

  render(props, state) {
    return (
      <div class="app">
        <button onClick={this.loadFile}>Load</button>
        <Header title={state.document.title} />
        <Editor ref={this.editor} dom={state.document} />
      </div>
    );
  }
}
