const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({
        width: Math.floor(width * 0.5),
        height: Math.floor(height * 0.5),
        icon: path.join(__dirname, "build/png/1024x1024.png"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile("index.html");

    win.center();

    win.removeMenu();

    // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
