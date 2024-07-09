import { app, globalShortcut, protocol } from 'electron';
import device from '@common/utils/device';
import env from '@common/utils/env';
import { CONFIG_GUIDE } from '@main/shared/db/constants';
import configModal from '@main/shared/db/modal/config';
import createShortcut from '@main/common/shortcut';
import MainBrowser from '@main/browser/main';
import PanelBrowser from '@main/browser/panel';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const main = new MainBrowser();
const panel = new PanelBrowser();

async function appReadyHandle() {
  try {
    const isGuide = await configModal.getConfig(CONFIG_GUIDE);
    console.log(isGuide, 'isGuide');
    if (!isGuide) {
      await configModal.setConfig(CONFIG_GUIDE, '1');
    } else {
    }
    main.init();
  } catch (e) {
    console.log(e);
  }
}

/**
 * 注册协议
 */
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

/**
 * 应用程序实例是否成功取得了锁。
 * 如果它取得锁失败，你可以假设另一个应用实例已经取得了锁并且仍旧在运行，并立即退出
 */
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

// 系统托盘
if (device.macOS()) {
  if (env.production() && !app.isInApplicationsFolder()) {
    app.moveToApplicationsFolder();
  } else {
    app.dock.hide();
  }
} else {
  app.disableHardwareAcceleration();
}

/**
 * 监听退出
 */
if (env.dev()) {
  if (device.windows()) {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

app.on('ready', () => {
  void appReadyHandle();
  createShortcut({
    mainWin: main,
    panelWin: panel
  });
});

app.on('window-all-closed', () => {
  if (!device.macOS()) app.quit();
});

app.on('will-quit', () => {
  /**
   * 应用退出前 取消所有快捷键
   */
  globalShortcut.unregisterAll();
});
