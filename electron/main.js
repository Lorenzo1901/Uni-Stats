import { app, BrowserWindow, protocol, net } from 'electron';
import path from 'path';
import { fileURLToPath, URL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure hot reload in development
const isDev = process.env.NODE_ENV === 'development';

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, bypassCSP: true } }
]);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true, // Hide the default menu bar
    backgroundColor: '#050505', // Match app background to prevent glitch
    show: false // Don't show the window until it's ready to prevent flickering
  });

  if (isDev) {
    // In development mode, wait for Vite dev server to start
    mainWindow.loadURL('http://localhost:5173');
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
  } else {
    // In production, load via custom protocol
    mainWindow.loadURL('app://-/index.html');
  }

  // Show window when content is loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  protocol.handle('app', (request) => {
    const url = new URL(request.url);
    const decodedPath = decodeURIComponent(url.pathname);
    const filePath = path.join(__dirname, '../dist', decodedPath);
    return net.fetch('file://' + filePath);
  });

  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
