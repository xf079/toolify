import { globalShortcut } from 'electron';
import db from '@shared/db';
// import { uIOhook, UiohookKey } from 'uiohook-napi'


class RegisterGlobalShortcut {
  constructor() {
    db.open();
    db.configs.add({
      key: 'CommandOrControl+X',
      value: 'CommandOrControl+X'
    });
  }
  init() {
    const values = db.configs.get('CommandOrControl+X');
    this.register();
    this.registerDouble('Alt+A', () => {
    });
    // uIOhook.on('keydown', (e) => {
    //   if (e.keycode === UiohookKey.Q) {
    //     console.log('Hello!')
    //   }
    //
    //   if (e.keycode === UiohookKey.Escape) {
    //     // process.exit(0)
    //   }
    // })
    //
    // uIOhook.start()
  }

  register() {
    // 注册快捷键
    // globalShortcut.register('CommandOrControl+X', () => {
    //   console.log('CommandOrControl+X is pressed');
    // });
  }

  /**
   * 注册双击
   * @param Key
   * @param callback
   */
  registerDouble(Key: string, callback: () => void) {
    const isRegistered = globalShortcut.isRegistered(Key);
    if (!isRegistered) {
      console.log('The shortcut has been registered');
    }
    let unitAlive = false;
    let timer: NodeJS.Timeout = null;
    // 注册快捷键
    globalShortcut.register(Key, () => {
      console.log('11');
      if (!unitAlive) {
        timer = setTimeout(() => {
          unitAlive = false;
        }, 160);
        unitAlive = true;
      } else {
        clearTimeout(timer);
        unitAlive = false;
        callback();
      }
    });
  }
}

const registerGlobalShortcut = new RegisterGlobalShortcut();

export default registerGlobalShortcut;
