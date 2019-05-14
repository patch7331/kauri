/** @format */

import { app, BrowserWindow, ipcMain } from "electron";
import fontManager from "font-manager"
import { format as formatUrl } from "url";
import * as path from "path";

const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference to the window object to prevent it from being
// destroyed by the garbage collector.
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow();

  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(
      `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    );
  } else {
    mainWindow.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      })
    );
  }

  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.webContents.on("devtools-opened", () => {
    mainWindow.focus();
    setImmediate(() => mainWindow.focus());
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  // On Mac OS it is common for applications and their menu bar to stay active
  // until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  // On Mac OS it is common to re-create a window in the app when the dock icon
  // is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on("getFontList", (event, args) => {
  fontManager.getAvailableFonts(fonts => {
    const fontArray = fonts
      .map(font => font.family)
      .filter((font, index, arr) => arr.indexOf(font) === index)
      .sort();
    event.sender.send("fontList", fontArray);
  });
});
