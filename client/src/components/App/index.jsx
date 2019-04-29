/** @format */

import "./styles.scss";
import demo from "./demo.json";
import { h, Component, createRef } from "preact";
import Editor from "components/Editor";
import Header from "components/Header";
import { remote } from "electron";

const POST_URI_OPEN_FILE = "http://127.0.0.1:3000/load";
// The menu template object here is based on the sample in the electron docs, with the Help menu removed
function getMenuTemplate(mainApp) {
  return [
    // Application menu for macOS
    ...(process.platform === "darwin"
      ? [
          {
            label: remote.app.getName(),
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    // File menu
    {
      label: "File",
      submenu: [
        {
          label: "Open ODT",
          data: mainApp,
          click(menuItem, browserWindow, event) {
            menuItem.data.loadFile();
          },
        },
        process.platform === "darwin" ? { role: "close" } : { role: "quit" },
      ],
    },
    // Edit menu
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(process.platform === "darwin"
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }],
              },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    // View menu
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    // Window menu
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(process.platform === "darwin"
          ? [
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" },
            ]
          : [{ role: "close" }]),
      ],
    },
  ];
}

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
    const menu = remote.Menu.buildFromTemplate(getMenuTemplate(this));
    remote.Menu.setApplicationMenu(menu);
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
        this.setState(json);
      })
      .catch(e => console.log(e));
  }

  render(props, state) {
    return (
      <div class="app">
        <Header title={state.document.title} />
        <Editor ref={this.editor} dom={state.document} />
      </div>
    );
  }
}
