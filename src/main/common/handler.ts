import { ipcMain } from 'electron';
import { isMac } from '@main/utils/is';
import pluginStore from '@main/utils/store/plugin';
import Separate from '@main/browser/separate';

function openApp(plugin: IPlugin) {
  if (isMac) {
    return;
  } else {
    return;
  }
}

/**
 * 全局消息处理
 */
export function eventHandler() {
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
        // 当前插件是否已经打开
        const isSelfPluginOpen = pluginStore.isSelfPluginOpen(plugin);
        // 是否分离为独立窗口
        const separation = plugin.separation;
        if (isSelfPluginOpen) {
        } else {
          // 创建窗口
          if (separation) {
            // 创建独立窗口
            const separate = new Separate();
            separate.openPlugin(plugin);
          } else {
            // 创建插件窗口
          }
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
