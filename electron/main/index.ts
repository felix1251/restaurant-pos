import { app, BrowserWindow, shell, ipcMain, dialog } from "electron";
import { release } from "node:os";
import { join } from "node:path";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//

process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, "../public")
    : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let mainWindow: BrowserWindow | null = null;
let loginWindow: BrowserWindow | null = null;
// let isLogin: boolean = false;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindow() {
    mainWindow = new BrowserWindow({
        title: "Main window",
        icon: join(process.env.PUBLIC, "favicon.ico"),
        width: 1350,
        height: 850,
        minWidth: 1000,
        minHeight: 700,
        // frame: false,
        webPreferences: {
            preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        // electron-vite-vue#298
        mainWindow.loadURL(url);
        // Open devTool if the app is not packaged
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(indexHtml);
    }

    // Test actively push message to the Electron-Renderer
    mainWindow.webContents.on("did-finish-load", () => {
        mainWindow?.webContents.send(
            "main-process-message",
            new Date().toLocaleString()
        );
    });

    // Make all links open with the browser, not with the application
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https:")) shell.openExternal(url);
        return { action: "deny" };
    });

    // win.on("close", (e) => {
    //     const response = dialog.showMessageBoxSync(this, {
    //         type: "question",
    //         buttons: ["Yes", "No"],
    //         title: "Confirm",
    //         message: "Are you sure you want to quit?",
    //     });
    //     if (response == 1) e.preventDefault();
    // });
    // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    mainWindow = null;
    if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
    if (mainWindow) {
        // Focus on the main window if the user tried to open another
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

app.on("activate", () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
        allWindows[0].focus();
    } else {
        createWindow();
    }
});

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`);
    } else {
        childWindow.loadFile(indexHtml, { hash: arg });
    }
});

// ipcMain.on("isLogin", (_, type, value) => {
//     if (type === "initial") isLogin = value;
// });
