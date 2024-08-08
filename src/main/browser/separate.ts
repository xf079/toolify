import { BaseWindow, ipcMain, nativeImage, WebContentsView } from 'electron';
import {
  SEPARATE_HEIGHT,
  SEPARATE_TOOLBAR_HEIGHT,
  SEPARATE_WIDTH
} from '@config/constants';
import path from 'node:path';
import loadSystemContentsUrl from '@main/utils/loadContentsUrl';
import store from '@main/utils/store';
import pluginStore from '@main/utils/store/plugin';
import { isDev } from '@main/utils/is';

const separateList: Separate[] = [];

class Separate {
  main: BaseWindow;
  detach: WebContentsView;
  content: WebContentsView;
  plugin: IPlugin;
  winId: number;

  openPlugin(plugin: IPlugin) {
    this.plugin = plugin;
    this.createSeparate(plugin);
  }

  /**
   * 创建主窗口
   */
  private createSeparate(plugin: IPlugin) {
    this.main = new BaseWindow({
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
    this.winId = this.main.id;
    this.createDetach();
    this.createContent();
    this.main.contentView.addChildView(this.detach);
    this.main.contentView.addChildView(this.content);

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

    pluginStore.addPlugin(plugin, this.content, this.main.id);
    this.handler(this.main.id);
  }

  /**
   * 创建状态栏
   */
  private createDetach() {
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

    void this.detach.webContents.executeJavaScript(`
      window.__id__ = ${this.winId};
      window.__plugin__ = ${JSON.stringify(this.plugin)}
    `);

    loadSystemContentsUrl(this.detach.webContents, 'detach');

  }

  /**
   * 创建插件内容视图
   */
  private createContent() {
    const pluginState = pluginStore.findPlugin(this.plugin.unique);
    // 当前插件view是否存在
    if (pluginState && !pluginState.single && pluginState.view.length) {
      const view = pluginState.view[pluginState.view.length - 1].view;
      console.log(view);
      this.content = view
    }else{
      this.content = new WebContentsView({
        webPreferences: {
          nodeIntegrationInWorker: true,
          contextIsolation: true,
          preload: path.join(__dirname, '../preload/index.js')
        }
      });
    }

    if(isDev){
      this.content.webContents.openDevTools()
    }

    this.content.setBounds({
      x: 0,
      y: 0,
      width: SEPARATE_WIDTH,
      height: SEPARATE_TOOLBAR_HEIGHT
    });
  }

  handler(winId: number) {
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
  }
}

export default function createSeparate(plugin: IPlugin) {
  const separate = new Separate();
  separate.openPlugin(plugin);
  separateList.push(separate);
}
