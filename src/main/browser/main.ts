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
import { match } from 'pinyin-pro';
import {
  WINDOW_HEIGHT,
  WINDOW_PLUGIN_HEIGHT,
  WINDOW_WIDTH,
  MAIN_CHANGE_WINDOW_HEIGHT,
  MAIN_OPEN_PLUGIN_MENU,
  MAIN_SEARCH,
  MAIN_SEARCH_FOCUS,
  MAIN_SYNC_CONFIG,
  BUILT_UPDATE_PLUGIN,
  BUILT_CREATE_PLUGIN,
  BUILT_REMOVE_PLUGIN,
  BUILT_PLUGIN_LIST,
  SYSTEM_PLUGIN_SETTINGS,
  SYSTEM_PLUGIN_CENTER,
  MAIN_HIDE,
  MAIN_SYNC_PLUGIN,
  MAIN_PLUGIN_OPEN,
  MAIN_PLUGIN_CLOSE
} from '@main/config/constants';
import PluginsModal from '@main/shared/modal/plugins';
import { setContentsUrl } from '@main/utils/window-path';
import DeveloperModal from '@main/shared/modal/developer';
import env from '@main/utils/env';

export interface IPluginItem {
  id: number;
  detail: IPlugin;
  plugin: WebContentsView;
}

export class MainBrowser {
  private main: BaseWindow;
  private search: WebContentsView;

  private pluginList: IPluginItem[] = [];
  private currentPlugin: number;

  constructor() {
    this.createMainWindow();
  }

  /**
   * 打开系统设置
   */
  public async openSystemSettings() {
    this.show();
    const systemSettings = await this.queryPluginInfo(SYSTEM_PLUGIN_SETTINGS);
    void this.openPlugin(systemSettings);
  }

  /**
   * 打开插件中心
   */
  public async openPluginCenter() {
    this.show();
    const systemSettings = await this.queryPluginInfo(SYSTEM_PLUGIN_CENTER);
    void this.openPlugin(systemSettings);
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

  /**
   * 查询指定插件信息
   * @param key
   * @private
   */
  private async queryPluginInfo(key: string) {
    const value = await PluginsModal.findOne({
      where: {
        unique: key
      }
    });
    if (!value) return;
    return value.dataValues as unknown as IPlugin;
  }

  private createSearchView() {
    return this.search;
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
      alwaysOnTop: true,
      backgroundColor: global.bgColor
    });
    this.search = new WebContentsView({
      webPreferences: {
        nodeIntegrationInWorker: true,
        preload: path.join(__dirname, '../preload/index.js')
      }
    });

    this.search.setBounds({
      x: 0,
      y: 0,
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT + WINDOW_PLUGIN_HEIGHT
    });

    setContentsUrl(this.search.webContents);

    this.main.contentView.addChildView(this.search);

    if (env.dev()) {
      this.search.webContents.openDevTools();
    }
    this.handle();
    this.shortcut();
  }

  /**
   * 搜索
   * @param value
   * @private
   */
  private async onSearch(value: string) {
    try {
      const pluginList = await PluginsModal.findAll();
      if (pluginList && pluginList.length) {
        const list = pluginList.map((item) => item.dataValues);
        const resultList: IPlugin[] = [];
        list.forEach((item: IPlugin) => {
          const indexList = match(item.name, value, {
            continuous: true,
            precision: 'every'
          });
          if (!(indexList || []).length) return;

          const nameList = item.name.split('');
          const nameFormat = nameList.map((val, index) => {
            if ((indexList || []).includes(index)) {
              return `<span style="color: hsl(var(--primary))">${val}</span>`;
            }
            return val;
          });
          resultList.push({ ...item, nameFormat: nameFormat.join('') });
        });
        return resultList;
      }
      return [];
    } catch (error) {
      console.log(error);
    }
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
      pluginView.setBackgroundColor(global.bgColor);

      this.main.contentView.addChildView(pluginView);

      setContentsUrl(pluginView.webContents, item.main);

      pluginView.webContents.on('did-finish-load', () => {
        // 通知搜索当前打开插件
        this.search.webContents.send(MAIN_SYNC_PLUGIN, item);
        // 设置窗体大小
        this.main.setContentSize(
          WINDOW_WIDTH,
          WINDOW_HEIGHT + WINDOW_PLUGIN_HEIGHT
        );
        this.main.setSize(WINDOW_WIDTH, WINDOW_HEIGHT + WINDOW_PLUGIN_HEIGHT);
        // 插件加载成功
        resolve(true);
      });

      this.currentPlugin = item.id;
      this.pluginList.push({
        id: item.id,
        plugin: pluginView,
        detail: item
      });
      if (env.dev()) {
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
        this.main.contentView.addChildView(current.plugin);
        current.plugin.webContents.reload();
        this.currentPlugin = item.id;
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
      // this.main.hide();
    });

    /**
     * 获取配置
     */
    ipcMain.handle(MAIN_SYNC_CONFIG, async () => {
      return global.configs;
    });

    /**
     * 插件搜索
     */
    ipcMain.handle(MAIN_SEARCH, async (event, value: string) => {
      return await this.onSearch(value);
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
     * 创建开发者插件
     */
    ipcMain.handle(BUILT_CREATE_PLUGIN, async (event, data) => {
      const res = await DeveloperModal.create(data);
      return res;
    });

    ipcMain.handle(BUILT_REMOVE_PLUGIN, async (event, id) => {
      const res = await DeveloperModal.destroy({
        where: { id }
      });
      return res;
    });

    ipcMain.handle(BUILT_UPDATE_PLUGIN, async (event, data) => {
      const res = await DeveloperModal.update(data, {
        where: {
          id: data.id
        }
      });
      return res;
    });

    ipcMain.handle(BUILT_PLUGIN_LIST, async () => {
      const res = await DeveloperModal.findAll();
      if (res) {
        return res.map((item) => item.dataValues);
      }
      return [];
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
            console.log(123);
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
          click: () => {
            console.log(123);
          }
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

export default MainBrowser;
