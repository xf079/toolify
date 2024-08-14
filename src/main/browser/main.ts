import { BaseWindow, WebContentsView } from 'electron';
import path from 'node:path';
import {
  PUBLIC_PLUGIN_PATH,
  WINDOW_HEIGHT,
  WINDOW_PLUGIN_HEIGHT,
  WINDOW_WIDTH
} from '@config/constants';
import { getDataPath, getSystemPluginPath } from '@main/utils/fs';
import store from '@main/utils/store';
import pluginStore from '@main/utils/store/plugin';
import { isDev } from '@main/utils/is';
import { getPosition } from '@main/utils/position';

export class MainBrowser {
  private x: number;
  private y: number;
  private defaultWidth: number;
  private defaultHeight: number;
  private scale = 1;

  private main: BaseWindow;
  private search: WebContentsView;

  private plugin: IPlugin;
  private pluginView: WebContentsView;

  public init() {
    this.createMainWindow();
  }
  /**
   * 显示窗口
   */
  public show() {
    this.main.show();
    this.search.webContents.focus();
    this.search.webContents.send('main:focus');
  }

  /**
   * 隐藏窗口
   */
  public hide() {
    this.main.hide();
  }

  /**
   * 打开插件
   * @param plugin
   */
  public async openPlugin(plugin: IPlugin) {
    this.plugin = plugin;
    this.search.webContents.send('main:pluginInfo', plugin);
    if (plugin.type === 'built') {
      return await this.createBuiltPluginView(plugin);
    } else if (plugin.type === 'plugin-prod' || plugin.type === 'plugin-dev') {
      return await this.createPluginView(plugin);
    }
  }

  /**
   * 关闭插件
   * @param destroy 是否卸载
   */
  public closePlugin(destroy = false) {
    if (!this.plugin || !this.pluginView) return;
    // 插件设置了自动卸载
    if (this.plugin.autoUninstalled && destroy) {
      pluginStore.destroyPlugin(this.plugin.unique);
    }
    this.main.contentView.removeChildView(this.pluginView);
    this.search.webContents.send('main:clearPluginInfo');
    this.plugin = undefined;
    this.pluginView = undefined;
    this.setExpendHeight(0);
  }

  /**
   * 获取当前插件
   */
  public getCurrentPlugin() {
    return {
      plugin: this.plugin,
      pluginView: this.pluginView
    };
  }

  /**
   * 更新主窗口高度自定义高度
   * @param height
   */
  public setExpendHeight(height: number) {
    // this.main.setContentSize(WINDOW_WIDTH, WINDOW_HEIGHT + height);
    console.log(WINDOW_HEIGHT + height);
    if (!this.plugin) {
      this.search.setBounds({
        x: 0,
        y: 0,
        width: this.defaultWidth,
        height: this.defaultHeight + height
      });
      this.main.setContentSize(this.defaultWidth, this.defaultHeight + height);
    }
    this.main.setPosition(this.x, this.y);
    setTimeout(() => {
      this.main.setSize(this.defaultWidth, this.defaultHeight + height);
    }, 0);
  }

  /**
   * 设置主窗口为插件大小
   * @private
   */
  public setWindowPluginHeight() {
    this.setExpendHeight(WINDOW_PLUGIN_HEIGHT);
  }

  /**
   * 创建系统插件窗口
   * @param item
   * @private
   */
  private createBuiltPluginView(item: IPlugin) {
    return new Promise((resolve) => {
      this.pluginView = new WebContentsView({
        webPreferences: {
          nodeIntegrationInWorker: true,
          contextIsolation: true,
          preload: path.join(__dirname, '../preload/index.js')
        }
      });
      this.pluginView.setBounds({
        x: 0,
        y: WINDOW_HEIGHT,
        width: WINDOW_WIDTH,
        height: WINDOW_PLUGIN_HEIGHT
      });
      this.pluginView.setBackgroundColor(store.getBackgroundColor());

      this.main.contentView.addChildView(this.pluginView);

      if (isDev) {
        void this.pluginView.webContents.loadURL(item.main);
        this.pluginView.webContents.openDevTools();
      } else {
        void this.pluginView.webContents.loadFile(
          getSystemPluginPath(item.main)
        );
      }

      this.pluginView.webContents.on('did-finish-load', () => {
        // 插件加载成功
        resolve(true);
        this.setWindowPluginHeight();
      });
      require('@electron/remote/main').enable(this.pluginView.webContents);
      pluginStore.addPlugin(item, this.pluginView);
    });
  }

  /**
   * 创建三方插件
   * @param item
   * @private
   */
  private createPluginView(item: IPlugin) {
    return new Promise((resolve) => {
      const pluginView = new WebContentsView({
        webPreferences: {
          nodeIntegrationInWorker: true,
          preload: path.join(__dirname, '../preload/index.js')
        }
      });
      pluginView.setBounds({
        x: 0,
        y: WINDOW_HEIGHT,
        width: WINDOW_WIDTH,
        height: WINDOW_PLUGIN_HEIGHT
      });
      pluginView.setBackgroundColor(store.getBackgroundColor());

      this.main.contentView.addChildView(pluginView);

      void pluginView.webContents.loadFile(
        getDataPath(PUBLIC_PLUGIN_PATH + `/${item.unique}/${item.main}`)
      );

      pluginView.webContents.on('did-finish-load', () => {
        // 插件加载成功
        resolve(true);
      });
      pluginStore.addPlugin(item, this.pluginView);
    });
  }

  /**
   * 创建主窗口
   * @private
   */
  private createMainWindow() {
    const { x, y } = getPosition();
    this.x = x;
    this.y = y;
    this.main = new BaseWindow({
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      x,
      y,
      useContentSize: true,
      resizable: false,
      fullscreenable: false,
      frame: false,
      title: 'Toolify',
      show: true,
      transparent: false,
      skipTaskbar: true,
      focusable: true,
      alwaysOnTop: true,
      backgroundColor: 'red'
    });
    this.search = new WebContentsView({
      webPreferences: {
        nodeIntegrationInWorker: true,
        nodeIntegration: true,
        contextIsolation: false,
        zoomFactor: 1.0,
        preload: path.join(__dirname, '../preload/index.js')
      }
    });
    this.main.contentView.addChildView(this.search);
    const [width, height] = this.main.getSize();
    this.defaultWidth = width;
    this.defaultHeight = height;

    this.scale = width / WINDOW_WIDTH;

    this.search.setBounds({
      x: 0,
      y: 0,
      width: Math.ceil(WINDOW_WIDTH *this.scale),
      height: Math.ceil(WINDOW_HEIGHT * this.scale)
    });

    if (isDev) {
      void this.search.webContents.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
      this.search.webContents.openDevTools();
    } else {
      void this.search.webContents.loadFile(
        getSystemPluginPath(MAIN_WINDOW_VITE_NAME)
      );
    }
    require('@electron/remote/main').enable(this.search.webContents);
    this.handler();
  }

  handler() {
    this.main.on('moved', () => {
      const [x, y] = this.main.getPosition();
      this.x = x;
      this.y = y;
    });
  }
}

const mainBrowser = new MainBrowser();

export default mainBrowser;
