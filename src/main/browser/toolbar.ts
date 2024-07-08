import { BrowserWindow } from 'electron';
import path from 'path';
import { TOOLBAR_HEIGHT, TOOLBAR_WIDTH } from '@common/constants/common';

export default class ToolbarWindow {
  private win: BrowserWindow;

  private createWindow() {
    this.win = new BrowserWindow({
      width: TOOLBAR_WIDTH,
      minHeight: TOOLBAR_HEIGHT,
      useContentSize: true,
      resizable: false,
      frame: false,
      transparent: true,
      show:true,
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
      void this.win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL+'#/toolbar');
    } else {
      void this.win.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html#/toolbar`)
      );
    }
    // Open the DevTools.
    this.win.webContents.openDevTools();
    this.win.on('show', () => {
      this.win.setAlwaysOnTop(true);
      this.win.focus();
    });

    this.win.on('blur', () => {
      this.win.close();
      this.win = null;
    });
  }

  init() {
    this.createWindow();
  }

  getWindow() {
    return this.win;
  }
}
