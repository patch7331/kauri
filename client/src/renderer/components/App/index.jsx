/** @format */

import "./styles.scss";
import demo from "./demo.json";
import { h, Component, createRef } from "preact";
import Editor from "components/Editor";
import Header from "components/Header";
import { remote } from "electron";
import setApplicationMenu from "util/MenuConfigurator.js";
import Clipboard from "components/Clipboard";

const POST_URI_OPEN_FILE = "http://127.0.0.1:3000/load";

export default class App extends Component {
  /**
   * Constructs a new app component.
   * @param {Object} props Component properties.
   */
  constructor(props) {
    super(props);
    this.state = { document: demo };
    this.loadFile = this.loadFile.bind(this);
    this.editor = createRef();
    setApplicationMenu(this.loadFile);
    document.execCommand("styleWithCSS", false, true);
  }

  /**
   * Opens a file selection dialog, sends the file path to the server, then parse the server's response and use it as the new state.
   */
  loadFile() {
    var filePath = remote.dialog.showOpenDialog({
      properties: ["openFile"],
    });
    fetch(POST_URI_OPEN_FILE, { method: "POST", body: filePath[0] })
      .then(resp => resp.json())
      .then(json => {
        this.editor.current.clearContentEditable();
        this.setState({ document: json });
      })
      .catch(e => console.log(e));
  }

  render(props, state) {
    return (
      <div class="app">
        <Header title={state.document.title} />
        <div class="app__wrapper">
          <Editor ref={this.editor} dom={state.document} />
          <Clipboard />
        </div>
      </div>
    );
  }
}
