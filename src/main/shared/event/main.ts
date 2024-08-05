import { ipcMain } from 'electron';
import store from '@main/utils/store';
import SettingsModal from '@main/modal/settings';
import { CONFIG_DEFAULT_TYPE } from '@main/config/constants';
import { onSearch } from '@main/common/search';
import mainBrowser from '@main/browser/main';

export const configMainEvent = () => {
  ipcMain.handle('main:getConfig', () => {
    return store.getConfig();
  });

  ipcMain.handle('main:setConfig', async (event, config) => {
    const res = await SettingsModal.update(config, {
      where: {
        type: CONFIG_DEFAULT_TYPE
      },
      returning: true
    });
  });

  ipcMain.handle('main:search', async (event, value: string) => {
    return await onSearch(value);
  });

  /**
   * change window height
   */
  ipcMain.on('main:changeWindowHeight', (event, height) => {
    mainBrowser.updateWindowRect(height);
  });
};
