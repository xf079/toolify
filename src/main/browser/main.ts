import {
  BaseWindow,
  globalShortcut,
  ipcMain,
  nativeTheme,
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
  WINDOW_WIDTH
} from '@common/constants/common';
import {
  MAIN_CHANGE_WINDOW_HEIGHT,
  MAIN_CLOSE_PLUGIN,
  MAIN_OPEN_PLUGIN,
  MAIN_OPEN_PLUGIN_MENU,
  MAIN_SEARCH,
  MAIN_SEARCH_FOCUS,
  MAIN_SYNC_CONFIG
} from '@common/constants/event-main';
import ThemeModal from '@main/shared/db/modal/theme';
import SettingsModal from '@main/shared/db/modal/settings';
import PluginsModal from '@main/shared/db/modal/plugins';
import { setContentsUrl } from '@common/utils/window-path';

export class MainBrowser {
  private baseWindow: BaseWindow;
  private searchView: WebContentsView;
  private pluginView: WebContentsView;

  private configs: GlobalConfigs;
  private theme: ThemeConfig;
  private settings: SettingsConfig;
  private backgroundColor: string;

  constructor() {
    void this.initWindowSettings();
  }

  async initWindowSettings() {
    await this.getSystemSettings();
    this.getWindowBgColor();
    this.createMainWindow();
  }

  async getSystemSettings() {
    try {
      const theme = await ThemeModal.findOne({
        where: { type: 'default' }
      });
      const settings = await SettingsModal.findOne({
        where: { type: 'default' }
      });

      if (theme) {
        this.theme = theme.dataValues;
      }
      if (settings) {
        this.settings = settings.dataValues;
      }

      this.configs = { theme: this.theme, settings: this.settings };
    } catch (err) {
      console.log(err);
    }
  }

  private getWindowBgColor() {
    const nativeColor = nativeTheme.shouldUseDarkColors ? '#000000' : '#FFFFFF';
    if (this.theme.theme === 'system') {
      this.backgroundColor = nativeColor;
    }
    this.backgroundColor = this.theme.theme === 'dark' ? '#000000' : '#FFFFFF';

    nativeTheme.on('updated', () => {
      this.backgroundColor = nativeColor;
    });
  }

  private getCurrentWindowRect() {
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

  private createMainWindow() {
    this.baseWindow = new BaseWindow({
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      x: 120,
      y: 20,
      useContentSize: false,
      resizable: false,
      fullscreenable: false,
      frame: false,
      title: 'Apeak',
      show: true,
      skipTaskbar: true,
      alwaysOnTop: true,
      backgroundColor: this.backgroundColor
    });

    this.searchView = new WebContentsView({
      webPreferences: {
        nodeIntegrationInWorker: true,
        preload: path.join(__dirname, '../preload/index.js')
      }
    });

    this.searchView.setBounds({
      x: 0,
      y: 0,
      width: WINDOW_WIDTH,
      height: WINDOW_PLUGIN_HEIGHT + WINDOW_HEIGHT
    });
    setContentsUrl(this.searchView.webContents);

    this.baseWindow.contentView.addChildView(this.searchView);

    this.searchView.webContents.on('did-finish-load', () => {
      this.searchView.webContents.send(MAIN_SYNC_CONFIG, this.configs);
    });

    // and load the index.html of the app.
    // Open the DevTools.
    this.searchView.webContents.openDevTools();

    this.handle();
    this.shortcut();
  }

  async onSearch(value: string) {
    try {
      const pluginList = await PluginsModal.findAll();
      if (pluginList && pluginList.length) {
        const list = pluginList.map((item) => item.dataValues);
        const resultList: IPlugin[] = [];
        list.forEach((item: IPlugin) => {
          const indexList = match(item.name, value);
          if (!(indexList || []).length) return;

          const nameList = item.name.split('');
          const nameFormat = nameList.map((val, index) => {
            if ((indexList || []).includes(index)) {
              return `<span style="color: ${this.theme.colorPrimary}">${val}</span>`;
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

  openPlugin(item: IPlugin) {
    return new Promise((resolve) => {
      this.pluginView = new WebContentsView({
        webPreferences: {
          nodeIntegrationInWorker: true,
          webgl: false,
          preload: path.join(__dirname, '../preload/index.js')
        }
      });
      this.baseWindow.contentView.addChildView(this.pluginView);
      this.pluginView.setBounds({
        x: 0,
        y: WINDOW_HEIGHT,
        width: WINDOW_WIDTH,
        height: WINDOW_PLUGIN_HEIGHT
      });
      this.pluginView.setBackgroundColor(this.backgroundColor);
      if (item.type === 'system') {
        console.log(222);
        setContentsUrl(this.pluginView.webContents, item.main);
        this.baseWindow.setSize(
          WINDOW_WIDTH,
          WINDOW_HEIGHT + WINDOW_PLUGIN_HEIGHT
        );
        this.baseWindow.setContentSize(
          WINDOW_WIDTH,
          WINDOW_HEIGHT + WINDOW_PLUGIN_HEIGHT
        );
        this.pluginView.webContents.on('did-finish-load', () => {
          console.log('333');
          this.pluginView.webContents.send(MAIN_SYNC_CONFIG, this.configs);
          resolve(true);
        });
      }
      this.pluginView.webContents.openDevTools();
    });
  }

  private handle() {
    /**
     *
     */
    // this.baseWindow.on('blur', () => {
    //   this.searchView.webContents.send(MAIN_HIDE);
    //   /**
    //    * 如果打开了插件
    //    * 清除插件相关窗口信息
    //    */
    //   if (this.pluginView) {
    //     this.baseWindow.contentView.removeChildView(this.pluginView);
    //     this.pluginView = null;
    //     this.baseWindow.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
    //     this.baseWindow.setContentSize(WINDOW_WIDTH, WINDOW_HEIGHT);
    //   }
    //   this.baseWindow.hide();
    // });

    ipcMain.handle(MAIN_SEARCH, async (event, value: string) => {
      return await this.onSearch(value);
    });

    ipcMain.handle(MAIN_OPEN_PLUGIN, async (event, item: IPlugin) => {
      if (item.type === 'app') {
        spawn('open', ['-a', item.main]);
      } else if (item.type === 'system') {
        await this.openPlugin(item);
      }
    });

    ipcMain.handle(MAIN_CLOSE_PLUGIN, async () => {
      if (this.pluginView) {
        this.baseWindow.contentView.removeChildView(this.pluginView);
        this.pluginView = null;
        this.baseWindow.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
        this.baseWindow.setContentSize(WINDOW_WIDTH, WINDOW_HEIGHT);
      }
    });

    ipcMain.on(MAIN_CHANGE_WINDOW_HEIGHT, (event, height) => {
      this.baseWindow.setSize(WINDOW_WIDTH, WINDOW_HEIGHT + height);
      this.baseWindow.setContentSize(WINDOW_WIDTH, WINDOW_HEIGHT + height);
    });

    ipcMain.on(MAIN_SEARCH_FOCUS, () => {
      this.baseWindow.focus();
      this.searchView.webContents.focus();
      this.searchView.webContents.send(MAIN_SEARCH_FOCUS);
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
        },
      ]
      const menu = Menu.buildFromTemplate(template)
      menu.popup({
      });
    });
  }
  private shortcut() {
    globalShortcut.register('CommandOrControl+0', () => {
      const point = this.getCurrentWindowRect();
      this.baseWindow.setPosition(point.x, point.y);
      this.baseWindow.show();
      this.baseWindow.focus();
      this.searchView.webContents.focus();
      this.searchView.webContents.send(MAIN_SEARCH_FOCUS);
    });
  }
}

export default MainBrowser;
