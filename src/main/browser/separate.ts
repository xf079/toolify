import { BaseWindow, ipcMain, nativeImage, WebContentsView } from 'electron';
import {
  DETACH_SERVICE,
  SEPARATE_HEIGHT,
  SEPARATE_TOOLBAR_HEIGHT,
  SEPARATE_WIDTH
} from '@main/config/constants';
import path from 'node:path';
import { setContentsUrl } from '@main/utils/window-path';

class Separate {
  private main: BaseWindow;
  private detach: WebContentsView;

  private plugin: IPlugin;
  private content: WebContentsView;

  openPlugin(plugin: IPlugin) {
    this.plugin = plugin;
    this.createSeparate();
    this.createContent();
  }

  createSeparate() {
    this.main = new BaseWindow({
      width: SEPARATE_WIDTH,
      height: SEPARATE_HEIGHT,
      minWidth: SEPARATE_WIDTH,
      minHeight: SEPARATE_HEIGHT,
      x: 100,
      y: 100,
      useContentSize: false,
      resizable: true,
      frame: false,
      center: true,
      title: this.plugin.name,
      icon: nativeImage.createFromPath(this.plugin.logo),
      show: true,
      focusable: true,
      skipTaskbar: false,
      hiddenInMissionControl: false,
      alwaysOnTop: true,
      backgroundColor: global.bgColor,
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: {
        x: 16,
        y: (SEPARATE_TOOLBAR_HEIGHT - 20) / 2
      }
    });
    this.detach = new WebContentsView({
      webPreferences: {
        nodeIntegrationInWorker: true,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload/index.js')
      }
    });

    this.detach.setBounds({
      x: 0,
      y: 0,
      width: SEPARATE_WIDTH,
      height: SEPARATE_TOOLBAR_HEIGHT
    });

    setContentsUrl(this.detach.webContents, 'detach');

    this.main.contentView.addChildView(this.detach);

    this.main.on('will-resize', (e, newBounds) => {
      this.detach.setBounds({
        x: 0,
        y: 0,
        width: newBounds.width,
        height: SEPARATE_TOOLBAR_HEIGHT
      });

      this.content.setBounds({
        x: 0,
        y: SEPARATE_TOOLBAR_HEIGHT,
        width: newBounds.width,
        height: newBounds.height - SEPARATE_TOOLBAR_HEIGHT
      });
    });

    this.handler();
  }

  createContent() {
    this.main.contentView.addChildView(this.content);
    this.content.setBounds({
      x: 0,
      y: SEPARATE_TOOLBAR_HEIGHT,
      width: SEPARATE_WIDTH,
      height: SEPARATE_HEIGHT - SEPARATE_TOOLBAR_HEIGHT
    });
  }

  handler() {
    ipcMain.on(`${DETACH_SERVICE}_${this.plugin.unique}`, (event, args) => {
      switch (args.type) {
        case 'minimize':
          this.main.minimize();
          break;
        case 'maximize':
          this.main.maximize();
          break;
        case 'restore':
          this.main.restore();
          break;
        case 'close':
          this.main.close();
          break;
      }

      if (args.type === 'maximize' || args.type === 'restore') {
        const bounds = this.main.getBounds();
        this.detach.setBounds({
          x: 0,
          y: 0,
          width: bounds.width,
          height: SEPARATE_TOOLBAR_HEIGHT
        });
        this.content.setBounds({
          x: 0,
          y: SEPARATE_TOOLBAR_HEIGHT,
          width: bounds.width,
          height: bounds.height - SEPARATE_TOOLBAR_HEIGHT
        });
      }
    });

    ipcMain.handle(`${DETACH_SERVICE}_${this.plugin.unique}`, (event, args) => {
      console.log(args);
      return this.plugin;
    });
  }
}

export default Separate;
