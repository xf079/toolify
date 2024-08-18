import { BaseWindow, WebContentsView } from 'electron';
import path from 'node:path';
import {
  WINDOW_HEIGHT,
  WINDOW_PLUGIN_HEIGHT,
  WINDOW_WIDTH
} from '@config/constants';
import { getSystemPluginPath } from '@main/utils/fs';
import store from '@main/utils/store';
import pluginStore from '@main/utils/store/plugin';
import { isDev } from '@main/utils/is';
import { getPosition } from '@main/utils/position';
import createSeparate from '@main/browser/separate';

export class MainBrowser {
  private x: number;
  private y: number;

  private main: BaseWindow;
  private search: WebContentsView;

  private plugin: IPlugin;
  private pluginView: WebContentsView;
  private load = false;

  public init() {
    this.createMainWindow();
  }
  /**
   * 显示窗口
   */
  public show() {
    this.main.show();
    this.search.webContents.focus();
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
   * @param view
   * @param load
   */
  public async openPlugin(
    plugin: IPlugin,
    view: WebContentsView,
    load: boolean
  ) {
    return new Promise((resolve) => {
      this.plugin = plugin;
      this.pluginView = view;
      this.main.contentView.addChildView(this.pluginView);
      this.pluginView.setBounds({
        x: 0,
        y: WINDOW_HEIGHT,
        width: WINDOW_WIDTH,
        height: WINDOW_PLUGIN_HEIGHT
      });
      this.pluginView.webContents.on('did-finish-load', () => {
        resolve(true);
        this.setWindowPluginHeight();
      });
      if (load) {
        setTimeout(() => {
          // 插件加载成功
          resolve(true);
          this.setWindowPluginHeight();
        }, 10);
      }
    });
  }

  separationWindow(){
    createSeparate(this.plugin, this.pluginView);
    this.setExpendHeight(0);
    this.main.contentView.removeChildView(this.pluginView);
    this.plugin = undefined;
    this.pluginView = undefined;
  }

  /**
   * 关闭插件
   * @param destroy 是否卸载
   */
  public closePlugin(destroy = false) {
    if (!this.plugin || !this.pluginView) return;
    // 插件设置了自动卸载
    if (this.plugin.autoUninstalled && destroy) {
      pluginStore.destroyPlugin(this.plugin.name);
    }
    this.main.contentView.removeChildView(this.pluginView);
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
    }
    this.search.webContents.setZoomFactor(1);
    this.main.setPosition(this.x, this.y);
    this.main.setSize(WINDOW_WIDTH, WINDOW_HEIGHT + height);
  }

  /**
   * 设置主窗口为插件大小
   * @private
   */
  public setWindowPluginHeight() {
    this.setExpendHeight(WINDOW_PLUGIN_HEIGHT);
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
      resizable: true,
      fullscreenable: false,
      frame: false,
      title: 'Toolify',
      show: true,
      transparent: false,
      skipTaskbar: true,
      focusable: true,
      alwaysOnTop: true,
      backgroundColor: store.getBackgroundColor()
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

    this.search.setBounds({
      x: 0,
      y: 0,
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT + WINDOW_PLUGIN_HEIGHT
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
