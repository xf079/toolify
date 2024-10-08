import {
  BaseWindow,
  Menu,
  nativeImage,
  WebContentsView,
  MenuItemConstructorOptions,
  MenuItem
} from 'electron';
import {
  SEPARATE_HEIGHT,
  SEPARATE_TOOLBAR_HEIGHT,
  SEPARATE_WIDTH
} from '@config/constants';
import path from 'node:path';
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

  scale = '100%';

  openPlugin(plugin: IPlugin, view: WebContentsView) {
    this.plugin = plugin;
    this.content = view;
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
      show: false,
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

    this.main.on('maximize', () => {
      console.log('maximize');
      this.updateWindowViewBounds();
      void this.detach.webContents.executeJavaScript(`
        window.maximizeWindow && window.maximizeWindow()
      `);
    });
    this.main.on('unmaximize', () => {
      console.log('unmaximize');
      this.updateWindowViewBounds();
      void this.detach.webContents.executeJavaScript(`
        window.unMaximize && window.unMaximize()
      `);
    });
    this.main.on('enter-full-screen', () => {
      console.log('enter-full-screen');
      this.updateWindowViewBounds();
      void this.detach.webContents.executeJavaScript(`
        window.enterFullScreen && window.enterFullScreen()
      `);
    });
    this.main.on('leave-full-screen', () => {
      console.log('leave-full-screen');
      this.updateWindowViewBounds();
      void this.detach.webContents.executeJavaScript(`
        window.leaveFullScreen && window.leaveFullScreen()
      `);
    });

    pluginStore.addPlugin(plugin, this.content, this.winId);
    this.handler();
  }

  private updateWindowViewBounds() {
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

  /**
   * 创建状态栏
   */
  private createDetach() {
    this.detach = new WebContentsView({
      webPreferences: {
        nodeIntegrationInWorker: true,
        nodeIntegration: true,
        contextIsolation: false,
        zoomFactor: 1,
        preload: path.join(__dirname, '../preload/index.js')
      }
    });

    this.detach.setBounds({
      x: 0,
      y: 0,
      width: SEPARATE_WIDTH,
      height: SEPARATE_TOOLBAR_HEIGHT
    });

    if (isDev) {
      void this.detach.webContents.loadURL(DETACH_WINDOW_VITE_DEV_SERVER_URL);
      // this.detach.webContents.openDevTools();
    } else {
      void this.detach.webContents.loadFile(
        `${path.join(__dirname, `../../renderer/${DETACH_WINDOW_VITE_NAME}/index.html`)}`
      );
    }
    this.main.contentView.addChildView(this.detach);

    this.detach.webContents.once('did-finish-load', () => {
      this.main.show();
    });
  }

  /**
   * 创建插件内容视图
   */
  private createContent() {
    this.main.contentView.addChildView(this.content);
    this.content.setBounds({
      x: 0,
      y: SEPARATE_TOOLBAR_HEIGHT,
      width: SEPARATE_WIDTH,
      height: SEPARATE_HEIGHT - SEPARATE_TOOLBAR_HEIGHT
    });
  }

  private handler() {
    this.detach.webContents.on('ipc-message', (event, channel, args) => {
      if (channel === 'detachService') {
        switch (args.type) {
          case 'minimize':
            this.main.minimize();
            void this.detach.webContents.executeJavaScript(`
              window.minimizeWindow && window.minimizeWindow()
            `);
            break;
          case 'maximize':
            this.main.maximize();
            break;
          case 'leave-fullscreen':
            this.main.setFullScreen(false);
            break;
          case 'restore':
            this.main.restore();
            break;
          case 'close':
            this.main.close();
            break;
          case 'debug':
            if (this.content.webContents.isDevToolsOpened()) {
              this.content.webContents.closeDevTools();
            } else {
              this.content.webContents.openDevTools();
            }
            break;
          case 'pined':
            this.main.setAlwaysOnTop(true);
            break;
          case 'un-pined':
            this.main.setAlwaysOnTop(false);
            break;
          case 'settings':
            this.openSettingsMenu();
            break;
          case 'scale':
            this.openScaleMenu();
            break;
          case 'info':
            this.openPluginInfo();
            break;
        }
      }
    });
    this.detach.webContents.on('ipc-message-sync', (event, channel) => {
      if (channel === 'initDetach') {
        event.returnValue = {
          id: this.winId,
          plugin: this.plugin
        }
      }
    });
  }

  private openSettingsMenu() {
    const template = [
      {
        label: '自动分离为独立窗口',
        click: () => {
          console.log(123);
        }
      },
      {
        label: '退出后台后立即结束运行',
        click: () => {
          console.log(123);
        }
      },
      {
        label: '跟随主程序同时启动运行',
        click: () => {}
      }
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup({});
  }
  private openScaleMenu() {
    const list = [
      '50%',
      '67%',
      '75%',
      '80%',
      '90%',
      '100%',
      '110%',
      '125%',
      '150%',
      '175%',
      '200%',
      '250%',
      '300%'
    ];

    const templateList: Array<MenuItemConstructorOptions | MenuItem> = list.map(
      (item) => {
        return {
          label: item,
          type: 'radio',
          checked: item === this.scale,
          click: () => {
            this.scale = item;
            const val = Number(item.replace('%', '')) / 100;
            this.content.webContents.setZoomFactor(val);
          }
        };
      }
    );

    const menu = Menu.buildFromTemplate(templateList);
    menu.popup({});
  }
  private openPluginInfo() {}
}

export default function createSeparate(plugin: IPlugin, view: WebContentsView) {
  const separate = new Separate();
  separate.openPlugin(plugin, view);
  separateList.push(separate);
}
