import { app, dialog, protocol } from 'electron';

import mainBrowser from '@main/browser/main';

import sequelizeSync from '@main/utils/db';
import initialization from '@main/common/initialization';
import initApplication from '@main/shared/application';

import createTray from '@main/common/tray';
import createShortcut from '@main/common/shortcut';
import initEventHandler from '@main/shared/eventHandler';

require('@electron/remote/main').initialize()

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

async function appReadyHandle() {
  await sequelizeSync();
  await initialization();
  void initApplication();
  try {
    mainBrowser.init();
    void createTray();
    void createShortcut();
    initEventHandler();
  } catch (e) {
    console.log(e);
  }
}

const agreement = 'electron-playground-code' // 自定义协议名

/**
 * 注册协议
 */
protocol.registerSchemesAsPrivileged([
  {
    scheme: agreement,
    privileges: { secure: true, standard: true, bypassCSP: true }
  }
]);
// 验证是否为自定义协议的链接
const AGREEMENT_REGEXP = new RegExp(`^${agreement}://`)
// 监听自定义协议唤起
function watchProtocol() {
  // mac唤醒应用 会激活open-url事件 在open-url中判断是否为自定义协议打开事件
  app.on('open-url', (event, url) => {
    const isProtocol = AGREEMENT_REGEXP.test(url)
    if (isProtocol) {
      console.log('获取协议链接, 根据参数做各种事情')
      dialog.showMessageBox({
        type: 'info',
        message: 'Mac protocol 自定义协议打开',
        detail: `自定义协议链接:${url}`,
      })
    }
  })
  // window系统下唤醒应用会激活second-instance事件 它在ready执行之后才能被监听
  app.on('second-instance', (event, commandLine) => {
    // commandLine 是一个数组， 唤醒的链接作为数组的一个元素放在这里面
    commandLine.forEach(str => {
      if (AGREEMENT_REGEXP.test(str)) {
        console.log('获取协议链接, 根据参数做各种事情')
        dialog.showMessageBox({
          type: 'info',
          message: 'window protocol 自定义协议打开',
          detail: `自定义协议链接:${str}`,
        })
      }
    })
  })
}

watchProtocol();
//
// /**
//  * 应用程序实例是否成功取得了锁。
//  * 如果它取得锁失败，你可以假设另一个应用实例已经取得了锁并且仍旧在运行，并立即退出
//  */
// const gotTheLock = app.requestSingleInstanceLock();
// if (!gotTheLock) {
//   app.quit();
// }
//
// // 系统托盘
// if (device.macOS()) {
//   if (env.production() && !app.isInApplicationsFolder()) {
//     app.moveToApplicationsFolder();
//   } else {
//     app.dock.hide();
//   }
// } else {
//   app.disableHardwareAcceleration();
// }

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
