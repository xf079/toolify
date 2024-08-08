import { ipcMain, Menu } from 'electron';
import store from '@main/utils/store';
import { DEFAULT_SETTINGS_KEY } from '@config/constants';
import mainBrowser from '@main/browser/main';
import pluginStore from '@main/utils/store/plugin';
import { onSearch } from '@main/common/search';
import SettingsModal from '@main/modal/settings';
import createSeparate from '@main/browser/separate';
import { isMac } from '@main/utils/is';

function openApp(plugin: IPlugin) {
  if (isMac) {
    return;
  } else {
    return;
  }
}


export const mainEventHandler = () => {
  ipcMain.handle('main:getSetting', () => {
    return store.getConfig();
  });

  ipcMain.handle('main:setSetting', async (event, setting) => {
    const [count, settings] = await SettingsModal.update(setting, {
      where: {
        type: DEFAULT_SETTINGS_KEY
      },
      returning: true
    });
    if (count) {
      const values = settings.map((item) => item.dataValues);
      store.setConfig(values[0]);
    }
  });

  ipcMain.handle('main:search', async (event, value: string) => {
    return await onSearch(value);
  });

  ipcMain.handle('main:currentPlugin', () => {
    const { plugin } = mainBrowser.getCurrentPlugin();
    return plugin;
  });

  /**
   * change window height
   */
  ipcMain.on('main:setWindowCustomHeight', (event, height) => {
    mainBrowser.setWindowCustomHeight(height);
  });


  /**
   * 打开插件
   */
  ipcMain.handle('main:openPlugin', async (event, plugin: IPlugin) => {
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
            // 创建插件窗口
            createSeparate(plugin)
          }else{
            // 当前插件已经打开
            // 窗口聚焦
            const pluginsState = pluginStore.findPlugin(plugin.unique)
            if(pluginsState){

            }
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
  ipcMain.on('main:closePlugin', (event, plugin: IPlugin) => {
    mainBrowser.closePlugin()
  });

  ipcMain.handle('main:openSystemPlugin',(event,args)=>{

  })

  /**
   * 关闭插件
   */
  ipcMain.on('main:destroyPlugin', (event, plugin: IPlugin) => {
    mainBrowser.closePlugin()
  });

  ipcMain.on('main:openPluginMenu', () => {
    const template = [
      {
        label: '分离为独立窗口',
        click: () => {
          const { plugin } = mainBrowser.getCurrentPlugin();
          if (plugin) {
            // 主窗口关闭
            mainBrowser.closePlugin();
            // 从独立窗口打开
            createSeparate(plugin)
          }
        }
      },
      {
        label: '插件应用设置',
        click: () => {
          console.log(123);
        }
      },
      {
        label: '退出到后台',
        click: () => {
          mainBrowser.closePlugin();
        }
      },
      {
        label: '结束运行',
        click: () => {
          const { plugin } = mainBrowser.getCurrentPlugin();
          mainBrowser.closePlugin(false);
          pluginStore.destroyPlugin(plugin.unique);
        }
      }
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup({});
  });
};
