/** @format */

import { remote } from "electron";
import { fetchDoc } from "redux/actions";
import store from "redux/store";

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Open",
        click: () => {
          const path = remote.dialog.showOpenDialog({
            properties: ["openFile"],
          });
          store.dispatch(fetchDoc(path));
        },
      },
      process.platform === "darwin" ? { role: "close" } : { role: "quit" },
    ],
  },
];

export function configureMenu() {
  console.log("Building menu");
  const menu = remote.Menu.buildFromTemplate(menuTemplate);
  remote.Menu.setApplicationMenu(menu);
}

/**
 * Sets up the global application menu.
 * @param {Object} mainApp The App React component to be used.
 */
export default function setApplicationMenu(loadFileFunction) {
  // The menu template object here is based on the sample in the electron docs, with the Help menu removed
  const menuTemplate = [
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
          click: loadFileFunction,
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
  const menu = remote.Menu.buildFromTemplate(menuTemplate);
  remote.Menu.setApplicationMenu(menu);
}
