import {
  BaseWindow,
  globalShortcut,
  ipcMain,
  WebContentsView,
  screen,
  Menu
} from 'electron';
import path from 'node:path';
import { spawn } from 'node:child_process';
import {
  WINDOW_HEIGHT,
  WINDOW_PLUGIN_HEIGHT,
  WINDOW_WIDTH,
  MAIN_CHANGE_WINDOW_HEIGHT,
  MAIN_OPEN_PLUGIN_MENU,
  MAIN_SEARCH,
  MAIN_SEARCH_FOCUS,
  MAIN_SYNC_CONFIG,
  MAIN_PLUGIN_OPEN,
  MAIN_PLUGIN_CLOSE
} from '@main/config/constants';
import { setContentsViewUrl } from '@main/utils/bowserUrl';
import { isDev } from '@main/utils/is';
import Separate from '@main/browser/separate';
import store from '@main/utils/store';
import { onSearch } from '@main/common/search';

export interface IPluginItem {
  id: number | string;
  detail: IPlugin;
  plugin: WebContentsView;
}

export class MainBrowser {
  private main: BaseWindow;
  private search: WebContentsView;

  init() {
    this.createMainWindow();
  }

  public getWindows() {
    return {
      main: this.main,
      search: this.search
    };
  }
  /**
   * 显示窗口
   */
  public show() {
    this.main.show();
    this.search.webContents.focus();
    this.search.webContents.send(MAIN_SEARCH_FOCUS);
  }

  /**
   * 隐藏窗口
   */
  public hide() {
    this.main.hide();
  }

  updateWindowRect(height: number) {
    this.main.setContentSize(WINDOW_WIDTH, WINDOW_HEIGHT + height);
    this.main.setSize(WINDOW_WIDTH, WINDOW_HEIGHT + height);
  }

  /**
   * 创建主窗口
   * @private
   */
  private createMainWindow() {
    this.main = new BaseWindow({
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      minWidth: WINDOW_WIDTH,
      maxWidth: WINDOW_WIDTH,
      minHeight: WINDOW_HEIGHT,
      maxHeight: WINDOW_HEIGHT + WINDOW_PLUGIN_HEIGHT,
      x: 100,
      y: 100,
      useContentSize: true,
      resizable: false,
      fullscreenable: false,
      frame: false,
      title: 'Apeak',
      show: true,
      skipTaskbar: true,
      focusable: true,
      alwaysOnTop: true,
      backgroundColor: store.getBackgroundColor()
    });
    this.search = new WebContentsView({
      webPreferences: {
        nodeIntegrationInWorker: true,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload/index.js')
      }
    });

    this.search.setBounds({
      x: 0,
      y: 0,
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT + WINDOW_PLUGIN_HEIGHT
    });

    setContentsViewUrl(this.search.webContents);

    this.main.contentView.addChildView(this.search);

    if (isDev) {
      this.search.webContents.openDevTools();
    }
    this.handle();
    this.shortcut();
  }

  /**
   * 设置创建为插件大小
   * @private
   */
  private setPluginWindowRect() {
    setTimeout(() => {
      // 设置窗体大小
      this.main.setContentSize(
        WINDOW_WIDTH,
        WINDOW_HEIGHT + WINDOW_PLUGIN_HEIGHT
      );
      this.main.setSize(WINDOW_WIDTH, WINDOW_HEIGHT + WINDOW_PLUGIN_HEIGHT);
    }, 120);
  }

  /**
   * 创建系统插件窗口
   * @param item
   * @private
   */
  private createBuiltPluginView(item: IPlugin) {
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
      setContentsUrl(pluginView.webContents, item.main);
      this.setPluginWindowRect();

      pluginView.webContents.on('did-finish-load', () => {
        // 插件加载成功
        resolve(true);
      });

      if (isDev) {
        pluginView.webContents.openDevTools();
      }
    });
  }

  /**
   * 打开插件
   * @param item
   * @private
   */
  private openPlugin(item: IPlugin) {
    return new Promise((resolve) => {
      const current = this.pluginList.find((_item) => _item.id === item.id);
      if (current) {
        this.currentPlugin = item.id;
        this.main.contentView.addChildView(current.plugin);
        this.setPluginWindowRect();
        resolve(true);
        return;
      }
      if (item.type === 'built') {
        this.createBuiltPluginView(item).then(resolve);
      }
    });
  }

  /**
   * 关闭当前插件窗口
   * @private
   */
  private closePlugin() {
    if (this.currentPlugin) {
      const _currentPlugin = this.pluginList.find(
        (plugin) => plugin.id === this.currentPlugin
      );
      this.main.contentView.removeChildView(_currentPlugin.plugin);
      this.currentPlugin = undefined;
      this.main.setContentSize(WINDOW_WIDTH, WINDOW_HEIGHT);
      this.main.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
    }
  }

  /**
   * 停止插件
   * @param item
   * @private
   */
  private destroyPlugin(item: IPlugin) {
    const plugin = this.pluginList.find((plugin) => plugin.id === item.id);
    if (plugin) {
      this.main.contentView.removeChildView(plugin.plugin);
      this.pluginList = this.pluginList.filter(
        (plugin) => plugin.id !== item.id
      );
    }
  }



  private handle() {
    /**
     * 失去焦点关闭插件
     */
    this.main.on('blur', () => {
      console.log(11);
      // this.main.hide();
    });

    /**
     * 获取配置
     */
    ipcMain.handle(MAIN_SYNC_CONFIG, async () => {
      return store.getConfig();
    });

    /**
     * 插件搜索
     */
    ipcMain.handle(MAIN_SEARCH, async (event, value: string) => {
      return await onSearch(value);
    });

    /**
     * 打开插件
     */
    ipcMain.handle(MAIN_PLUGIN_OPEN, async (event, item: IPlugin) => {
      if (item.type === 'app') {
        spawn('open', ['-a', item.main]);
      } else {
        await this.openPlugin(item);
      }
    });

    /**
     * 关闭插件
     */
    ipcMain.on(MAIN_PLUGIN_CLOSE, () => {
      this.closePlugin();
    });

    /**
     * 搜索状态 修改窗口大小
     */
    ipcMain.on(MAIN_CHANGE_WINDOW_HEIGHT, (event, height) => {
      this.main.setContentSize(WINDOW_WIDTH, WINDOW_HEIGHT + height);
      this.main.setSize(WINDOW_WIDTH, WINDOW_HEIGHT + height);
    });

    ipcMain.on(MAIN_SEARCH_FOCUS, () => {
      this.main.focus();
      this.search.webContents.focus();
      this.search.webContents.send(MAIN_SEARCH_FOCUS);
    });

    ipcMain.on(MAIN_OPEN_PLUGIN_MENU, () => {
      const template = [
        {
          label: '分离为独立窗口',
          click: () => {
            console.log('小盒子', 123);
            const item = this.pluginList.find(
              (item) => item.id === this.currentPlugin
            );
            if (item) {
              console.log(123);
              const separate = new Separate();
              separate.openPlugin(item.detail, item.plugin);
            }
          }
        },
        {
          label: '插件应用设置',
          click: () => {
            console.log(123);
          }
        },
        {
          label: '退出到后台',
          click: () => {}
        },
        {
          label: '结束运行',
          click: () => {
            console.log(123);
          }
        }
      ];
      const menu = Menu.buildFromTemplate(template);
      menu.popup({});
    });
  }

  /**
   * 获取当前鼠标位置
   * @private
   */
  private _getCurrentMouseRect() {
    const cursorPoint = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);
    let x = currentDisplay.bounds.x;
    let y = currentDisplay.bounds.y;

    const windowHeight = WINDOW_HEIGHT + WINDOW_PLUGIN_HEIGHT;

    x += (currentDisplay.bounds.width - WINDOW_WIDTH) / 2;
    y += (currentDisplay.bounds.height - windowHeight) / 2;

    return {
      x,
      y
    };
  }

  private shortcut() {
    globalShortcut.register('CommandOrControl+U', () => {
      const point = this._getCurrentMouseRect();
      // this.main.setPosition(point.x, point.y);
      // this.main.show();
      // this.main.focus();
      // this.search.webContents.focus();
      // this.search.webContents.send(MAIN_SEARCH_FOCUS);
    });
  }
}

const mainBrowser = new MainBrowser();

export default mainBrowser;
