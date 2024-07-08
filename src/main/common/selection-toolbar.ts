import iohook from 'iohook-raub';
import { keyboard, clipboard, Key, mouse } from '@nut-tree/nut-js';
import { BrowserWindow } from 'electron';
import path from 'node:path';
import { Point } from '@nut-tree/shared';

class SelectionToolbar {
  unitAlive = false;
  timer: NodeJS.Timeout;

  toolbarWindow: BrowserWindow;

  originValue = '';
  currentValue = '';

  constructor() {
    // todo 读取配置文件是否开启划词工具栏
  }

  init() {
    this.registerShortcut();
  }

  dispose() {
    iohook.removeAllListeners();
  }

  registerShortcut() {
    iohook.on('keyup', (event) => {
      if (event.metaKey) {
        if (this.unitAlive) {
          // 关闭
          this.unitAlive = false;
          void this.openToolbar();
        } else {
          this.unitAlive = true;
          this.timer = setTimeout(() => {
            this.unitAlive = false;
            clearTimeout(this.timer);
          }, 260);
        }
      }
    });
  }

  createToolbarWindow(point: Point) {
    // todo 创建划词工具栏
    this.toolbarWindow = new BrowserWindow({
      width: 600,
      height: 420,
      x: point.x,
      y: point.y - 60,
      frame: false,
      transparent: false
    });
    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      console.log(path.join(MAIN_WINDOW_VITE_DEV_SERVER_URL, 'toolbar'));
      void this.toolbarWindow.loadURL(
        path.join(MAIN_WINDOW_VITE_DEV_SERVER_URL, '#', 'toolbar')
      );
    } else {
      void this.toolbarWindow.loadFile(
        path.join(
          __dirname,
          `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
          '#',
          'toolbar'
        )
      );
    }
    this.toolbarWindow.on('show',()=>{
      this.toolbarWindow.setAlwaysOnTop(true);
      this.toolbarWindow.focus();
    })

    this.toolbarWindow.on('blur',()=>{
      this.toolbarWindow.close();
      this.toolbarWindow = null;
    })
  }
  async openToolbar() {
    const point = await mouse.getPosition();
    this.createToolbarWindow(point);
  }

  async hasOpenToolbar() {
    await this.getClipboardValue();
    await this.getCurrentSelection();
    if (this.currentValue) {
      console.log(this.originValue, this.currentValue);
    }
  }
  async getClipboardValue() {
    this.originValue = await clipboard.getContent();
  }

  async getCurrentSelection() {
    await keyboard.pressKey(Key.Comma, Key.C);
    await keyboard.releaseKey(Key.Comma, Key.C);
    const currentValue = await clipboard.getContent();
    this.currentValue = currentValue;
    if (currentValue) {
      await clipboard.setContent(this.originValue);
    }
  }
}

export default new SelectionToolbar();
