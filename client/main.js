/** @format */

const { app, BrowserWindow, ipcMain } = require("electron");
const fontManager = require("font-manager");

// Keep a global reference to the window object to prevent it from being
// destroyed by the garbage collector.
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile("index.html");
  mainWindow.on("closed", () => (mainWindow = null));
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
