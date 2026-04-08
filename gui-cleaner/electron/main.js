const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec, spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    titleBarStyle: 'hidden',
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  });

  // In development, load from Vite dev server
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  win.once('ready-to-show', () => {
    win.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-stats', async () => {
  const paths = [
    { name: 'Windows Temp', path: 'C:\\Windows\\Temp' },
    { name: 'Prefetch', path: 'C:\\Windows\\Prefetch' },
    { name: 'User Temp', path: process.env.TEMP || path.join(os.homedir(), 'AppData\\Local\\Temp') }
  ];

  const stats = [];
  for (const item of paths) {
    try {
      if (fs.existsSync(item.path)) {
        const files = fs.readdirSync(item.path);
        stats.push({ name: item.name, path: item.path, count: files.length, exists: true });
      } else {
        stats.push({ name: item.name, path: item.path, count: 0, exists: false });
      }
    } catch (e) {
      stats.push({ name: item.name, path: item.path, count: 0, exists: true, error: e.message });
    }
  }
  return stats;
});

ipcMain.handle('run-python-script', async (event) => {
  const pythonPath = 'python'; // Assume python in PATH
  const scriptPath = path.join(app.getAppPath(), '..', 'script-temp', 'script.py');
  
  return new Promise((resolve) => {
    const python = spawn(pythonPath, [scriptPath]);
    let output = '';
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      output += `ERROR: ${data.toString()}`;
    });

    python.on('close', (code) => {
      resolve({ code, output });
    });
  });
});

ipcMain.handle('clean-folder', async (event, folderPath) => {
  const results = [];
  if (!fs.existsSync(folderPath)) {
    return [{ status: 'error', message: `Pasta não encontrada: ${folderPath}` }];
  }

  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    try {
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
      results.push({ name: file, status: 'success' });
    } catch (e) {
      results.push({ name: file, status: 'error', message: e.message });
    }
  }
  return results;
});

ipcMain.handle('check-admin', async () => {
  return new Promise((resolve) => {
    exec('net session', (err) => {
      resolve(!err);
    });
  });
});
