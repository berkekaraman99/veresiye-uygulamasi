import { app, BrowserWindow } from "electron";
import { join } from "path";
import { spawn } from "child_process";

let mainWindow;
let backendProcess;
const __dirname = import.meta.dirname;

// function startBackend() {
//   return new Promise((resolve) => {
//     const pathToBackend = isDev ? path.join(__dirname, "backend", "src", "index.ts") : path.join(app.getAppPath(), "backend", "dist", "index.js");

//     backendProcess = spawn(isDev ? "ts-node" : "node", [pathToBackend], {
//       cwd: path.dirname(pathToBackend),
//       stdio: "inherit",
//       shell: true,
//     });

//     backendProcess.on("error", (err) => {
//       console.error("Backend process error:", err);
//     });
//   });
// }

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(join(__dirname, "client/dist/index.html"));
}

function startBackend() {
  return new Promise((resolve) => {
    const isDev = !app.isPackaged;

    const backendScript = isDev ? join(__dirname, "node_modules", ".bin", process.platform === "win32" ? "ts-node" : "ts-node") : process.execPath;

    const backendPath = isDev ? join(__dirname, "server", "src", "index.ts") : join(process.resourcesPath, "server", "dist", "index.js");

    backendProcess = spawn(backendScript, [backendPath], {
      stdio: "inherit",
      shell: true,
    });

    backendProcess.on("error", (err) => {
      console.error("❌ Backend başlatılamadı:", err);
    });

    backendProcess.on("exit", (code) => {
      console.log(`⛔ Backend kapandı. Kod: ${code}`);
    });

    console.log("app.getAppPath():", app.getAppPath());
    console.log("Backend script path:", backendPath);
    console.log("__dirname: ", __dirname);

    // Uygulama kapanırken backend’i de kapat
    app.on("before-quit", () => {
      if (backendProcess) {
        backendProcess.kill();
      }
    });

    // Ana pencere kapanırsa da backend'i durdur
    mainWindow?.on("close", () => {
      if (backendProcess) {
        backendProcess.kill();
        app.quit();
      }
    });
  });
}

app.on("ready", () => {
  startBackend();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
