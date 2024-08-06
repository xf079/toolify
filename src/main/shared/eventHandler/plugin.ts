import { ipcMain } from 'electron';
import pluginStore from '@main/utils/store/plugin';
import { isMac } from '@main/utils/is';
import mainBrowser from '@main/browser/main';
import separateBrowser from '@main/browser/separate';


function openApp(plugin: IPlugin) {
  if (isMac) {
    return;
  } else {
    return;
  }
}


export function pluginEventHandler(){

  /**
   * 打开插件
   */
  ipcMain.handle('plugin:open', async (event, plugin: IPlugin) => {
    switch (plugin.type) {
      case 'app':
        openApp(plugin);
        break;
      case 'built':
      case 'plugin':
      case 'plugin:dev':
        // 是否分离为独立窗口
        const separation = plugin.separation;
        if(separation){
          // 当前插件是否已经打开
          const isSelfPluginOpen = pluginStore.isSelfPluginOpen(plugin);
          // 没有打开或者支持多开
          if(!isSelfPluginOpen || plugin.single){
            separateBrowser.openPlugin(plugin);
          }else{
            // 窗口聚焦
            const pluginsState = pluginStore.findPlugin(plugin.id)
          }
        }else{
          await mainBrowser.openPlugin(plugin);
        }
        break;
      case 'ai':
        break;
    }
  });

  /**
   * 关闭插件
   */
  ipcMain.on('plugin:close', (event, plugin: IPlugin) => {
    mainBrowser.closePlugin(plugin)
  });
}