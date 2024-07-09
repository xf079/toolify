import { BrowserWindow } from 'electron';
import path from 'path';
import { PANEL_HEIGHT, PANEL_WIDTH } from '@common/constants/common';
import { IBrowserWindow, ICreateWindowOption } from '@common/types';
import { clipboard, Key, keyboard } from '@nut-tree/nut-js';
import device from '@common/utils/device';

class PanelBrowser extends IBrowserWindow {
  private win: BrowserWindow;

  originValue = '';
  currentValue = '';

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

  private createWindow(option?: ICreateWindowOption) {
    this.win = new BrowserWindow({
      width: PANEL_WIDTH,
      height: PANEL_HEIGHT,
      useContentSize: true,
      resizable: false,
      frame: false,
      x: option?.x,
      y: option?.y,
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
      void this.win.loadFile(MAIN_WINDOW_VITE_DEV_SERVER_URL, {
        hash: '/panel'
      });
    } else {
      void this.win.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
        {
          hash: '/panel'
        }
      );
    }
  }

  private start(option?: ICreateWindowOption) {
    this.createWindow(option);
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
      this.win.close();
      this.win = null;
    });
  }

  private async hasClipboardValueEquals() {
    await this.getOriginValue();
    await this.getCurrentValue();
    return this.originValue === this.currentValue;
  }

  private async getOriginValue() {
    this.originValue = await clipboard.getContent();
  }

  private async getCurrentValue() {
    if (device.windows()) {
      await keyboard.pressKey(Key.LeftControl, Key.C);
      await keyboard.releaseKey(Key.LeftControl, Key.C);
    } else {
      await keyboard.pressKey(Key.LeftCmd, Key.C);
      await keyboard.releaseKey(Key.LeftCmd, Key.C);
    }
    this.currentValue = await clipboard.getContent();
  }

  private resetClipboard() {
    void clipboard.setContent(this.originValue);
  }
}

export default PanelBrowser;
