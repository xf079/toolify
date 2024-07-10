import {  globalShortcut } from 'electron';
import { IBrowserWindow } from '@common/types';
import { mouseLocaion } from 'rubick-native';

export interface IShortcutOption {
  mainWin: IBrowserWindow;
  panelWin: IBrowserWindow;
}

export default function createShortcut(option: IShortcutOption) {
  /**
   * 注册超级面板快捷键
   * @param {string} 'CommandOrControl+Q' - 快捷键
   */
  globalShortcut.register('CommandOrControl+Q', async () => {
    void option.panelWin.init(mouseLocaion());
  });
  /**
   * 注册搜索快捷键
   * @param {string} 'CommandOrControl+Q' - 快捷键
   */
  globalShortcut.register('CommandOrControl+L', async () => {
    void option.mainWin.init();
  });
}
