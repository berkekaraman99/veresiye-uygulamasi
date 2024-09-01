import { app, BrowserWindow } from "electron";
import { dirname, join, resolve } from "node:path";

const __dirname = resolve(dirname(""));

const createWindow = () => {
  const win = new BrowserWindow({
    height: 720,
    width: 1280,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  win.webContents.openDevTools();
  win.loadFile("dist/index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
