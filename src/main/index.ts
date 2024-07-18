import { app, protocol } from 'electron';
import MainBrowser from '@main/browser/main';
import PanelBrowser from '@main/browser/panel';

import { sequelizeSync } from '@main/shared/db';
import initApplication from '@main/shared/application';
import initDefaultConfig from '@main/shared/config/init-config';
import device from '@common/utils/device';
import env from '@common/utils/env';


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

async function appReadyHandle() {
  await sequelizeSync();
  await initDefaultConfig();
  await initApplication()
  try {
    const main = new MainBrowser();
    const panel = new PanelBrowser();
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

// /**
//  * 监听退出
//  */
// if (env.dev()) {
//   if (device.windows()) {
//     process.on('message', (data) => {
//       if (data === 'graceful-exit') {
//         app.quit();
//       }
//     });
//   } else {
//     process.on('SIGTERM', () => {
//       app.quit();
//     });
//   }
// }
//
app.on('ready', () => {
  void appReadyHandle();
});
//
// app.on('window-all-closed', () => {
//   if (!device.macOS()) app.quit();
// });
//
// app.on('will-quit', () => {
//   /**
//    * 应用退出前 取消所有快捷键
//    */
//   globalShortcut.unregisterAll();
// });
