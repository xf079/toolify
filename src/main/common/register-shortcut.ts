import { globalShortcut } from 'electron';

class RegisterShortcut {

  init() {
    // const values = db.configs.get('CommandOrControl+X');
    // this.register();
    // this.registerDouble('Alt+A', () => {});
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

const registerShortcut = new RegisterShortcut();

export default registerShortcut;
