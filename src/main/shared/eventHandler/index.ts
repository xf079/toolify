import { ipcMain } from 'electron';
import { onSearch } from '@main/common/search';
import { EVENT_MESSENGER } from '@config/constants';
import mainBrowser from '@main/browser/main';

function createPluginView(){

}


export default function initEventHandler() {
  // mainEventHandler();
  // developerEventHandler();

  ipcMain.handle(EVENT_MESSENGER, async (event, { type, data }) => {
    console.log(type, data);
    switch (type) {
      case 'search':
        return onSearch(data);
      case 'openPlugin':
        return await mainBrowser.openPlugin(data);
      default:
        break;
    }
  });

  ipcMain.on(EVENT_MESSENGER, (event, { type, data }) => {
    switch (type) {
      case 'setExpendHeight':
        mainBrowser.setExpendHeight(data);
        break;
      default:
        break;
    }
  });
}
