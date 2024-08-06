import { ipcMain } from 'electron';
import store from '@main/utils/store';
import { DEFAULT_SETTINGS_KEY } from '@config/constants';
import { onSearch } from '@main/common/search';
import mainBrowser from '@main/browser/main';
import SettingsModal from '@main/modal/settings';
import pluginStore from '@main/utils/store/plugin';

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

  ipcMain.handle('main:currentPlugin',()=>{
    return pluginStore.getSelfPlugin()
  })

  /**
   * change window height
   */
  ipcMain.on('main:windowHeight', (event, height) => {
    mainBrowser.updateWindowHeight(height);
  });

};
