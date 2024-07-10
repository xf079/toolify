import { BrowserWindow } from 'electron';
import path from 'node:path';
import {
  WINDOW_HEIGHT,
  WINDOW_MIN_HEIGHT,
  WINDOW_WIDTH
} from '@common/constants/common';
import { IBrowserWindow } from '@common/types';

export class MainBrowser implements IBrowserWindow {
  private win: BrowserWindow;

  constructor() {
    this.createMainWindow();
  }

  private createMainWindow() {
    this.win = new BrowserWindow({
      height: WINDOW_HEIGHT,
      minHeight: WINDOW_MIN_HEIGHT,
      useContentSize: true,
      resizable: true,
      width: WINDOW_WIDTH,
      frame: true,
      title: 'Apeak',
      center: true,
      show: true,
      skipTaskbar: true,
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
      this.win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      this.win.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
      );
    }
    // and load the index.html of the app.
    // Open the DevTools.
    this.win.webContents.openDevTools();
  }

  getWindow() {
    return this.win;
  }

  init() {
    this.win.show();
    this.handle();
  }

  private handle() {
    console.log('handle');
  }
}

export default MainBrowser;
