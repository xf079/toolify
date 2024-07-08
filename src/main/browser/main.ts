import { BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import {
  WINDOW_HEIGHT,
  WINDOW_MIN_HEIGHT,
  WINDOW_WIDTH
} from '@common/constants/common';

export default class MainWindow {
  private win: BrowserWindow;

  private createWindow() {
    this.win = new BrowserWindow({
      height: WINDOW_HEIGHT,
      minHeight: WINDOW_MIN_HEIGHT,
      useContentSize: true,
      resizable: true,
      width: WINDOW_WIDTH,
      frame: true,
      title: 'Apeak',
      show: true,
      skipTaskbar: true,
      backgroundColor: nativeTheme.shouldUseDarkColors ? '#1c1c28' : '#fff',
      webPreferences: {
        webSecurity: false,
        backgroundThrottling: false,
        contextIsolation: false,
        webviewTag: true,
        webgl: false,
        nodeIntegration: true,
        preload: path.join(__dirname, '..', 'preload/index.js'),
        spellcheck: false
      }
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      void this.win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      void this.win.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
      );
    }
    // Open the DevTools.
    this.win.webContents.openDevTools();

    this.win.on('closed', () => {
      this.win = undefined;
    });

    this.win.on('show', () => {
      this.win.webContents.executeJavaScript(
        `window.rubick && window.rubick.hooks && typeof window.rubick.hooks.onShow === "function" && window.rubick.hooks.onShow()`
      );
    });

    this.win.on('hide', () => {
      this.win.webContents.executeJavaScript(
        `window.rubick && window.rubick.hooks && typeof window.rubick.hooks.onHide === "function" && window.rubick.hooks.onHide()`
      );
    });

    // 判断失焦是否隐藏
    this.win.on('blur', async () => {
      console.log('blur');
    });
  }

  init() {
    this.createWindow();
  }

  getWindow() {
    return this.win;
  }
}
