import { mainEventHandler } from './main';
import { developerEventHandler } from './developer';
import { ipcMain } from 'electron';
import store from '@main/utils/store';

export default function initEventHandler() {
  mainEventHandler();
  developerEventHandler();

  ipcMain.handle('event-trigger', (event, { type, data }) => {
    console.log(type, data);
    switch (type) {
      case 'getSettings':
        return store.getConfig();
      case 'setSetting':
        return store.setConfig(data);
      default:
        break;
    }
  });
}
