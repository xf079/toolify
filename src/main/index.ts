import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
// eslint-disable-next-line import/no-unresolved
import { getAppList } from '@common/utils/app.list';
import {
  WINDOW_HEIGHT,
  WINDOW_MIN_HEIGHT, WINDOW_PLUGIN_HEIGHT,
  WINDOW_WIDTH
} from '@common/constants/common';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  console.log(WINDOW_HEIGHT);
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    minWidth: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    minHeight: WINDOW_MIN_HEIGHT,
    resizable: false,
    frame:false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload/index.js')
    }
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    void mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    void mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('changeWindowResize', (event, arg) => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (arg.type === 'maximize') {
    mainWindow?.setSize(WINDOW_WIDTH, WINDOW_PLUGIN_HEIGHT)
  } else if(arg.type === 'minimize') {
    mainWindow?.setSize(WINDOW_WIDTH, WINDOW_HEIGHT)
  }else if(arg.type === 'custom'){
    mainWindow?.setSize(arg.width, arg.height)
  }
});

ipcMain.on('getAppList', (event, arg) => {
  getAppList().then((res) => {
    event.reply('appList', res);
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
