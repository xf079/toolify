import { ipcRenderer } from 'electron';
import { DEVELOPER_MESSAGE, EVENT_MESSENGER } from '@config/constants';
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
  const mainToolify: IMainEventHandler = {
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

    separationWindow() {
      send('separationWindow', undefined);
    },

    /**
     * 关闭插件 - 后台仍在运行
     * @param destroy 是否卸载
     */
    closePlugin(destroy?: boolean) {
      send('closePlugin', destroy);
    },

    /**
     * 独立窗口事件
     * @param callback 回调函数
     */
    initDetach(callback) {
      const event = ipcRenderer.sendSync('initDetach')
      if(callback && typeof callback === 'function') {
        callback(event);
      }
    },
    detachService(type: string, data?: any) {
      ipcRenderer.send('detachService', {
        type,
        data
      });
    },

    /**
     * 开发者工具插件相关
     * @param data
     */
    createDeveloperPlugin(data:IPlugin){
      return ipcRenderer.invoke(DEVELOPER_MESSAGE, {
        type: 'create',
        data
      });
    },
    updateDeveloperPlugin(data:IPlugin){
      return ipcRenderer.invoke(DEVELOPER_MESSAGE, {
        type: 'update',
        data
      });
    },
    refreshDeveloperPlugin(name:string){
      return ipcRenderer.invoke(DEVELOPER_MESSAGE, {
        type: 'refresh',
        data: name
      });
    },
    deleteDeveloperPlugin(name:string){
      return ipcRenderer.invoke(DEVELOPER_MESSAGE, {
        type: 'delete',
        data: name
      });
    },
    getDeveloperPlugins(){
      return ipcRenderer.invoke(DEVELOPER_MESSAGE, {
        type: 'getDeveloperPlugins',
        data: undefined
      });
    }
  };
  Object.defineProperty(window, 'toolify', {
    value: { ...commonToolify, ...mainToolify },
    configurable: false,
    writable: false
  });
})();
