import {  globalShortcut } from 'electron';
import { mouse } from '@nut-tree/nut-js';
import { IBrowserWindow } from '@common/types';

export interface IShortcutOption {
  mainWin: IBrowserWindow;
  panelWin: IBrowserWindow;
}

export default function createShortcut(option: IShortcutOption) {
  /**
   * 注册超级面板快捷键
   * @param {string} 'CommandOrControl+Q' - 快捷键
   */
  globalShortcut.register('CommandOrControl+P', async () => {
    try {
      const position = await mouse.getPosition();
      void option.panelWin.init(position);
    } catch (error) {
      console.log(error);
    }
  });
}
