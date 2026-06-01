const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // 加载应用的 index.html
  mainWindow.loadFile('index.html');

  // 打开开发者工具
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC通信 - 打开文件对话框
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: '图片文件', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'] },
      { name: '所有文件', extensions: ['*'] }
    ]
  });
  return result;
});

// IPC通信 - 保存图片
ipcMain.handle('save-image', async (event, imageData, defaultPath) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultPath || 'image.png',
    filters: [
      { name: 'PNG图片', extensions: ['png'] },
      { name: 'JPEG图片', extensions: ['jpg', 'jpeg'] },
      { name: '所有文件', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled && result.filePath) {
    try {
      fs.writeFileSync(result.filePath, imageData, 'base64');
      return { success: true, path: result.filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  return { success: false, canceled: true };
});
