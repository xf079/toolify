import { shell } from 'electron';
import { dialog, Menu } from '@electron/remote';

type ISync = (type: string, data?: any) => Promise<any>;
type ISend = (type: string, data?: any) => void;

export function genCommonToolify(sync: ISync, send: ISend) {
  return {
    /**
     * 生命周期
     * 插件进入
     * @param cb
     */
    onPluginEnter(cb) {
      typeof cb === 'function' && (window.__hooks__.onPluginEnter = cb);
    },
    /**
     * 生命周期
     * 插件加载完成
     * @param cb
     */
    onPluginReady(cb) {
      typeof cb === 'function' && (window.__hooks__.onPluginReady = cb);
    },
    /**
     * 生命周期
     * 插件退出
     * @param cb
     */
    onPluginOut(cb) {
      typeof cb === 'function' && (window.__hooks__.onPluginOut = cb);
    },

    /**
     * 选择插件
     * @param name
     */
    choosePlugin: async (name: string) => {
      return await sync('choosePlugin', name);
    },

    showOpenDialog: async (options) => {
      return await dialog.showOpenDialog(options);
    },
    showOpenMenu: (options, popupOptions) => {
      const menu = Menu.buildFromTemplate(options);
      menu.popup(popupOptions);
    },
    showSaveDialog: (options) => {
      return dialog.showSaveDialogSync(options);
    },

    setExpendHeight(height) {
      send('setExpendHeight', height);
    },
    shellOpenPath: async (fullPath) => {
      return await shell.openPath(fullPath);
    },
    shellOpenExternal: async (url) => {
      console.log(url);
      return await shell.openExternal(url);
    }
  } as ICommonEventHandler;
}
