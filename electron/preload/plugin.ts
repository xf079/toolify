import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('apeak', {
  /**
   * 获取应用版本
   */
  getAppVersion(){
    return ipcRenderer.invoke('get-app-version')
  },
  /**
   * 获取应用配置
   */
  getAppConfig(){
    return ipcRenderer.invoke('get-app-config')
  },
})


