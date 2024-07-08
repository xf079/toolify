import { app, BrowserWindow, globalShortcut, protocol } from 'electron';

import device from '@common/utils/device';
import env from '@common/utils/env';

import selectionToolbar from '@main/common/selection-toolbar';
import configModal from '@shared/db/modal/config';
import { CONFIG_GUIDE } from '@shared/db/constants';

import MainWindow from '@main/browser/main';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

export interface IWindow {
  init(): void;
  getWindow(): BrowserWindow;
}

class Main {
  windowCreator: IWindow;
  constructor() {
    this.init();
  }

  init() {
    /**
     * 注册协议
     */
    protocol.registerSchemesAsPrivileged([
      { scheme: 'app', privileges: { secure: true, standard: true } }
    ]);

    this.windowCreator = new MainWindow();
    /**
     * 应用程序实例是否成功取得了锁。
     * 如果它取得锁失败，你可以假设另一个应用实例已经取得了锁并且仍旧在运行，并立即退出
     */
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.quit();
      return;
    }
    this.beforeReady();
    this.ready();
    this.running();
    this.quit();
  }

  beforeReady() {
    // 系统托盘
    if (device.macOS()) {
      if (env.production() && !app.isInApplicationsFolder()) {
        app.moveToApplicationsFolder();
      } else {
        // app.dock.hide();
      }
    } else {
      app.disableHardwareAcceleration();
    }
  }

  ready() {
    const readyHandle = async () => {
      try {
        const isGuide = await configModal.getConfig(CONFIG_GUIDE);
        console.log(isGuide,'isGuide');
        if(!isGuide){
          await configModal.setConfig(CONFIG_GUIDE, '1');
        }
        this.windowCreator.init();
      } catch (e) {
        console.log(e);
      }
    };
    app.on('ready', () => {
      console.log('ready');
      void readyHandle();
    });
  }

  running() {
    console.log('running');
    selectionToolbar.init();
  }

  quit() {
    app.on('window-all-closed', () => {
      if (!device.macOS()) app.quit();
    });

    app.on('will-quit', () => {
      /**
       * 退出前销毁划词工具栏
       */
      selectionToolbar.dispose();
      /**
       * 应用退出前 取消所有快捷键
       */
      globalShortcut.unregisterAll();
    });

    if (env.dev()) {
      if (device.windows()) {
        process.on('message', (data) => {
          if (data === 'graceful-exit') {
            app.quit();
          }
        });
        return;
      }
      process.on('SIGTERM', () => {
        app.quit();
      });
    }
  }
}

new Main();

//
// const createWindow = () => {
//   console.log(WINDOW_HEIGHT);
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     width: WINDOW_WIDTH,
//     minWidth: WINDOW_WIDTH,
//     height: WINDOW_HEIGHT,
//     minHeight: WINDOW_MIN_HEIGHT,
//     resizable: true,
//     frame: true,
//     webPreferences: {
//       preload: path.join(__dirname, '..', 'preload/index.js')
//     }
//   });
//
//   protocol.registerFileProtocol('apeak', (request, callback) => {
//     const filePath = request.url.replace('apeak:///', '');
//     callback(filePath);
//   });
//
//   // and load the index.html of the app.
//   if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
//     void mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
//   } else {
//     void mainWindow.loadFile(
//       path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
//     );
//   }
//
//   registerGlobalShortcut.init();
//   selectionToolbar.init();
//
//   async function handleAppList() {
//     return await systemApplication.getAppList();
//   }
//
//   ipcMain.handle('system:appList', handleAppList);
//
//   // Open the DevTools.
//   mainWindow.webContents.openDevTools();
// };
//
// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);
//
// // Quit when all windows are closed, except on macOS. There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });
//
// app.on('activate', () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });
//
// ipcMain.on('changeWindowResize', (event, arg) => {
//   const mainWindow = BrowserWindow.getFocusedWindow();
//   if (arg.type === 'maximize') {
//     mainWindow?.setSize(WINDOW_WIDTH, WINDOW_PLUGIN_HEIGHT, true);
//   } else if (arg.type === 'minimize') {
//     mainWindow?.setSize(WINDOW_WIDTH, WINDOW_HEIGHT, true);
//   } else if (arg.type === 'custom') {
//     mainWindow?.setSize(arg.width, arg.height);
//   }
// });
// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and import them here.
