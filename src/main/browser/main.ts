import { ipcMain, BrowserWindow } from 'electron';
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
      resizable: false,
      width: WINDOW_WIDTH,
      frame: false,
      title: 'Apeak',
      center: true,
      show: true,
      skipTaskbar: true,
      webPreferences: {
        webgl: false,
        preload: path.join(__dirname, '../preload/index.js'),
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
    this.handle();
    // and load the index.html of the app.
    // Open the DevTools.
    // this.win.webContents.openDevTools();
  }

  getWindow() {
    return this.win;
  }

  init() {
    this.win.show();
  }

  private handle() {
    ipcMain.on('search', (event, phrase) => {
      console.log(event,phrase);
      const _valueList = new Array(Number(phrase)).fill(1);
        console.log(_valueList);
      this.win.webContents.send('searchList', _valueList)
    });

    ipcMain.on('setWindowHeight', (event, height) => {
      console.log(height);
      this.win.setSize(WINDOW_WIDTH, WINDOW_MIN_HEIGHT+height,true);
    })
  }
}

export default MainBrowser;
