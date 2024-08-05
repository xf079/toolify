import { ipcMain } from 'electron';
import device from '@main/utils/device';
import MainBrowser from '@main/browser/main';
import pluginStore from '@main/shared/store/plugin';

function openApp(plugin: IPlugin) {
  if (device.macOS()) {
    return;
  } else {
    return;
  }
}

/**
 * 全局消息处理
 * @param main
 */
export function eventHandler(main: MainBrowser) {
  /**
   * 打开插件
   */
  ipcMain.handle('open:plugin', (event, plugin: IPlugin) => {

    switch (plugin.type) {
      case 'app':
        openApp(plugin);
        break;
      case 'built':
      case 'plugin':
      case 'plugin:dev':
        const isSelfPluginOpen = pluginStore.isSelfPluginOpen(plugin)
        // 是否分离为独立窗口
        const separation = plugin.separation;
        if (isSelfPluginOpen) {

        }else{
          // 创建窗口
        }
        break;
      case 'ai':
        break;
    }
  });

  /**
   * 关闭插件
   */
  ipcMain.on('close:plugin', (event, plugin: IPlugin) => {});
}
