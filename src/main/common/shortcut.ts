import { globalShortcut } from 'electron';

export default function createShortcut() {
  /**
   * 注册超级面板快捷键
   * @param {string} 'CommandOrControl+Q' - 快捷键
   */
  globalShortcut.register('CommandOrControl+Q', async () => {
    // void option.panelWin.init(mouseLocaion());
    // void option.panelWin.init();
  });

  /**
   * 注册搜索快捷键
   * @param {string} 'CommandOrControl+Q' - 快捷键
   */
  globalShortcut.register('CommandOrControl+L', async () => {
    // void option.mainWin.init();
  });
}
