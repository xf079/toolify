import { BrowserWindow } from 'electron';
import path from 'node:path';
import { PANEL_HEIGHT, PANEL_WIDTH } from '@common/constants/common';
import { IBrowserWindow, ICreateWindowOption } from '@common/types';
import device from '@common/utils/device';
import {
  sendKeyboardSimulation,
  getClipboardContent,
  ClipboardContent
} from 'rubick-native';

class PanelBrowser implements IBrowserWindow {
  private win: BrowserWindow;

  originValue: ClipboardContent;
  currentValue: ClipboardContent;

  constructor() {
    this.createWindow();
  }

  private createWindow() {
    this.win = new BrowserWindow({
      width: PANEL_WIDTH,
      height: PANEL_HEIGHT,
      useContentSize: true,
      resizable: false,
      frame: false,
      x: 0,
      y: 0,
      show: false,
      transparent:true,
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
      this.win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + '#/panel');
    } else {
      // and load the index.html of the app.
      this.win.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
        { hash: '/panel' }
      );
    }
  }

  async init(position: ICreateWindowOption) {
    const hasClipboardValueEquals = await this.hasClipboardValueEquals();
    if (hasClipboardValueEquals) {
      this.start(position);
    } else {
      this.start(position);
    }
    this.resetClipboard();
  }

  getWindow() {
    return this.win;
  }

  private start(option?: ICreateWindowOption) {
    this.win.setBounds({
      x: option?.x - PANEL_WIDTH / 2,
      y: option?.y - 40
    });
    this.win.show();
    this.handle();
  }

  private handle() {
    // Open the DevTools.
    // this.win.webContents.openDevTools();
    this.win.on('show', () => {
      this.win.setAlwaysOnTop(true);
      this.win.focus();
    });
    this.win.on('blur', () => {
      this.win.hide();
    });
  }

  private async hasClipboardValueEquals() {
    await this.getOriginValue();
    await this.getCurrentValue();
    return this.originValue === this.currentValue;
  }

  private async getOriginValue() {
    this.originValue = getClipboardContent();
  }

  private async getCurrentValue() {
    try {
      if (device.windows()) {
        sendKeyboardSimulation('{+CTRL}c{-CTRL}');
        // await keyboard.pressKey(Key.LeftControl, Key.C);
        // await keyboard.releaseKey(Key.LeftControl, Key.C);
      } else {
        sendKeyboardSimulation('{+CTRL}c{-CTRL}');
        // await keyboard.pressKey(Key.LeftCmd, Key.C);
        // await keyboard.releaseKey(Key.LeftCmd, Key.C);
      }

      const s = getClipboardContent();
      console.log('====>', s);
    } catch (error) {
      console.log(error);
    }
  }

  private resetClipboard() {
    // void clipboard.setContent(this.originValue);
  }
}

export default PanelBrowser;
