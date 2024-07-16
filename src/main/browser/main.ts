import { BrowserWindow, BrowserView, ipcMain, nativeTheme } from 'electron';
import path from 'node:path';
import {
  WINDOW_HEIGHT,
  WINDOW_MIN_HEIGHT,
  WINDOW_PLUGIN_HEIGHT,
  WINDOW_WIDTH
} from '@common/constants/common';
import { IBrowserWindow } from '@common/types';
import {
  MAIN_CHANGE_WINDOW_HEIGHT,
  MAIN_OPEN_PLUGIN,
  MAIN_SYNC_FORM_DATA
} from '@common/constants/event-main';
import { Op } from 'sequelize';
import ThemeModal from '@main/shared/db/modal/theme';
import SettingsModal from '@main/shared/db/modal/settings';
import PluginsModal from '@main/shared/db/modal/plugins';
import { spawn } from 'node:child_process';

export class MainBrowser implements IBrowserWindow {
  private win: BrowserWindow;

  constructor() {
    this.createMainWindow();
  }

  private createMainWindow() {
    this.win = new BrowserWindow({
      height: WINDOW_HEIGHT,
      minHeight: WINDOW_MIN_HEIGHT,
      useContentSize: true,
      resizable: false,
      width: WINDOW_WIDTH,
      frame: false,
      title: 'Apeak',
      center: true,
      show: true,
      skipTaskbar: true,
      alwaysOnTop: false,
      backgroundColor: '#fff',
      webPreferences: {
        nodeIntegrationInWorker: true,
        webgl: false,
        preload: path.join(__dirname, '../preload/index.js')
      }
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      this.win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      this.win.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
      );
    }

    this.handle();
    // and load the index.html of the app.
    // Open the DevTools.
    // this.win.webContents.openDevTools();
  }

  getWindow() {
    return this.win;
  }

  init() {
    this.win.show();
  }

  async getConfig() {
    try {
      const theme = await ThemeModal.findOne({
        where: {
          type: 'default'
        },
        attributes: ['theme', 'compact', 'colorPrimary']
      });

      const settings = await SettingsModal.findOne({
        where: {
          type: 'default'
        },
        attributes: ['start', 'guide', 'language', 'placeholder']
      });
      const plugins = await PluginsModal.findAll();
      return {
        theme: theme.dataValues,
        settings: settings.dataValues,
        plugins: plugins.map((item) => item.dataValues)
      };
    } catch (err) {
      console.log(err);
    }
  }

  async onSearch(value: string) {
    try {
      const pluginList = await PluginsModal.findAll({
        where: {
          name: { [Op.like]: `%${value}%` }
        }
      });

      if (pluginList && pluginList.length) {
        return pluginList.map((item) => item.dataValues);
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  }

  openPlugin(item: IPlugin) {
    const view = new BrowserView({
      webPreferences: {
        nodeIntegrationInWorker: true,
        webgl: false,
        preload: path.join(__dirname, '../preload/index.js')
      }
    });
    this.win.setBrowserView(view);
    view.setBounds({
      x: 0,
      y: WINDOW_MIN_HEIGHT,
      width: WINDOW_WIDTH,
      height: WINDOW_PLUGIN_HEIGHT
    });
    view.webContents.openDevTools()
    view.setBackgroundColor('red');
    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      console.log('111');
      view.webContents.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL+'#/detach');
    } else {
      console.log('222');
      view.webContents.loadFile(
        path.join(
          __dirname,
          `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html#/system/${item.main}`
        )
      );
    }
  }

  private handle() {
    /**
     * 主页面渲染完成
     */
    this.win.webContents.on('did-finish-load', async () => {
      const data = await this.getConfig();
      this.win.webContents.send(MAIN_SYNC_FORM_DATA, data);
    });

    /**
     * 配置页面同步
     */
    ipcMain.on(MAIN_SYNC_FORM_DATA, async (event, data) => {
      try {
        if (data.type === 'theme') {
          await ThemeModal.update(data.value, {
            where: {
              type: 'default'
            }
          });
          // 修改主题需要同步系统主题
          if (data.value.theme) {
            nativeTheme.themeSource = data.value.theme;
          }
        }

        if (data.type === 'settings') {
          await SettingsModal.update(data.value, {
            where: {
              type: 'default'
            }
          });
        }
      } catch (error) {
        console.log(error);
      }

      const configData = await this.getConfig();

      this.win.webContents.send(MAIN_SYNC_FORM_DATA, configData);
    });

    ipcMain.on(MAIN_CHANGE_WINDOW_HEIGHT, (event, height) => {
      this.win.setSize(WINDOW_WIDTH, WINDOW_MIN_HEIGHT + height);
    });

    ipcMain.on(MAIN_OPEN_PLUGIN, (event, item: IPlugin) => {
      if (item.type === 'app') {
        spawn('open', ['-a', item.main]);
      } else if (item.type === 'system') {
        this.openPlugin(item);
      }
    });
  }
}

export default MainBrowser;
