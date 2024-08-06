import { BaseWindow, ipcMain, nativeImage, WebContentsView } from 'electron';
import {
  DETACH_SERVICE,
  SEPARATE_HEIGHT,
  SEPARATE_TOOLBAR_HEIGHT,
  SEPARATE_WIDTH
} from '@main/config/constants';
import path from 'node:path';
import loadSystemContentsUrl from '@main/utils/loadContentsUrl';
import store from '@main/utils/store';
import pluginStore from '@main/utils/store/plugin';

class Separate {
  openPlugin(plugin: IPlugin) {
    this.createSeparate(plugin);
  }

  /**
   * 创建主窗口
   */
  createSeparate(plugin: IPlugin) {
    const main = new BaseWindow({
      width: SEPARATE_WIDTH,
      height: SEPARATE_HEIGHT,
      minWidth: SEPARATE_WIDTH,
      minHeight: SEPARATE_HEIGHT,
      useContentSize: false,
      resizable: true,
      frame: false,
      center: true,
      title: plugin.name,
      icon: nativeImage.createFromPath(plugin.logo),
      show: true,
      focusable: true,
      skipTaskbar: false,
      hiddenInMissionControl: false,
      alwaysOnTop: false,
      backgroundColor: store.getBackgroundColor(),
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: {
        x: 16,
        y: (SEPARATE_TOOLBAR_HEIGHT - 20) / 2
      }
    });
    const detach = this.createDetach();
    const content = this.createContent();
    main.contentView.addChildView(detach);

    main.on('will-resize', (e, newBounds) => {
      detach.setBounds({
        x: 0,
        y: 0,
        width: newBounds.width,
        height: SEPARATE_TOOLBAR_HEIGHT
      });

      content.setBounds({
        x: 0,
        y: SEPARATE_TOOLBAR_HEIGHT,
        width: newBounds.width,
        height: newBounds.height - SEPARATE_TOOLBAR_HEIGHT
      });
    });

    pluginStore.openPlugin(main.id, plugin, content);

    // this.handler();
  }

  createDetach() {
    const detach = new WebContentsView({
      webPreferences: {
        nodeIntegrationInWorker: true,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload/index.js')
      }
    });

    detach.setBounds({
      x: 0,
      y: 0,
      width: SEPARATE_WIDTH,
      height: SEPARATE_TOOLBAR_HEIGHT
    });

    loadSystemContentsUrl(detach.webContents, 'detach');
    return detach;
  }

  createContent() {
    const content = new WebContentsView({
      webPreferences: {
        nodeIntegrationInWorker: true,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload/index.js')
      }
    });

    content.setBounds({
      x: 0,
      y: 0,
      width: SEPARATE_WIDTH,
      height: SEPARATE_TOOLBAR_HEIGHT
    });
    return content;
  }

  handler(winId:number) {
    ipcMain.on(`detach:${winId}`, (event, args) => {
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

const separateBrowser = new Separate();

export default separateBrowser;
