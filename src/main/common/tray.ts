import {
  Tray,
  Menu,
  shell,
  app,
  dialog,
  nativeTheme
} from 'electron';
import device from '@main/utils/device';
import os from 'node:os';
import path from 'node:path';
import { getPublicIcon } from '@main/utils/os';
import MainBrowser from '@main/browser/main';

import pkg from '../../../package.json';

export default async function createTray(main: MainBrowser) {
  let icon;
  if (device.macOS()) {
  } else if (device.windows()) {
    icon =
      parseInt(os.release()) < 10
        ? '../resources/icon/icon.ico'
        : '../resources/icon/icon.ico';
  } else {
  }
  const appTray = new Tray(path.join(__dirname, icon));

  const createContextMenu = () => {
    return Menu.buildFromTemplate([
      {
        label: '帮助文档',
        icon: getPublicIcon('help-icon'),
        click: () => {
          process.nextTick(() => {
            void shell.openExternal('https://github.com/xf079/apeak');
          });
        }
      },
      {
        label: '引导教学',
        icon: getPublicIcon('guide-icon'),
        click: () => {
          // guide().init();
        }
      },
      {
        label: '意见反馈',
        icon: getPublicIcon('issues-icon'),
        click: () => {
          process.nextTick(() => {
            void shell.openExternal('github.com/xf079/apeak/issues');
          });
        }
      },
      {
        label: '关于Apeak',
        icon: getPublicIcon('about-icon'),
        click() {
          void dialog.showMessageBox({
            title: 'Apeak',
            message: '极简、插件化的现代桌面软件',
            detail: `Version: ${pkg.version}\nAuthor: xfo79k`
          });
        }
      },
      { type: 'separator' },
      {
        label: '显示',
        icon: getPublicIcon('show-icon'),
        click() {
          main.show();
        }
      },
      {
        label: '系统设置',
        icon: getPublicIcon('settings-icon'),
        click() {
          main.openSystemSettings();
        }
      },
      { type: 'separator' },
      {
        label: '重启',
        icon: getPublicIcon('restart-icon'),
        click() {
          app.relaunch();
          app.quit();
        }
      },
      {
        role: 'quit',
        icon: getPublicIcon('logout-icon'),
        label: '退出'
      }
    ]);
  };

  appTray.on('click', () => {
    // show
    main.show();
  });
  appTray.setContextMenu(createContextMenu());

  nativeTheme.addListener('updated', () => {
    appTray.setContextMenu(createContextMenu());
  });
}
