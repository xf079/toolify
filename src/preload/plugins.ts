import { ipcRenderer } from 'electron';
import { dialog } from '@electron/remote';

function sync(type: string, data?: any) {
  const returnValue = ipcRenderer.invoke('event-trigger', {
    type,
    data
  });
  if (returnValue instanceof Error) throw returnValue;
  return returnValue;
}

function send(type: string, data: any) {
  ipcRenderer.send('event-trigger', {
    type,
    data
  });
}

(function () {
  const _toolify: Toolify = {
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

    async getSettings() {
      return await sync('getSettings');
    },
    setSettings(settings) {
      send('setSettings', settings);
    },

    /**
     * 选择插件
     * @param name
     */
    choosePlugin: async (name: string) => {
      return await sync('choosePlugin', name);
    }
  };
  Object.defineProperty(window, 'toolify', {
    value: _toolify,
    configurable: false,
    writable: false
  });
})();
