import { ipcRenderer } from 'electron';
import { EVENT_MESSENGER } from '@config/constants';
import { genCommonToolify } from './common';

function sync(type: string, data?: any) {
  const returnValue = ipcRenderer.invoke(EVENT_MESSENGER, {
    type,
    data
  });
  if (returnValue instanceof Error) throw returnValue;
  return returnValue;
}

function send(type: string, data?: any) {
  ipcRenderer.send(EVENT_MESSENGER, {
    type,
    data
  });
}

(function () {
  const commonToolify = genCommonToolify(sync, send);
  const mainToolify: IMainEventHandler  = {
    search(value) {
      return sync('search', value);
    },

    /**
     * 打开插件
     * @param name
     */
    openPlugin: async (name: string) => {
      return await sync('openPlugin', name);
    },

    separationWindow(){
      send('separationWindow',undefined);
    },

    /**
     * 关闭插件 - 后台仍在运行
     * @param destroy 是否卸载
     */
    closePlugin(destroy?: boolean) {
      send('closePlugin', destroy);
    }
  };
  Object.defineProperty(window, 'toolify', {
    value: { ...commonToolify,...mainToolify },
    configurable: false,
    writable: false
  });
})();
