import { ipcMain } from 'electron';
import { onSearch } from '@main/common/search';
import { DEVELOPER_MESSAGE, EVENT_MESSENGER } from '@config/constants';
import mainBrowser from '@main/browser/main';
import createPlugin from '@main/utils/plugin';
import createSeparate from '@main/browser/separate';
import Plugins from '@main/modal/plugins';

export default function initEventHandler() {
  ipcMain.handle(EVENT_MESSENGER, async (event, { type, data }) => {
    switch (type) {
      case 'search':
        return onSearch(data);
      case 'openPlugin':
        const item = await Plugins.findOne({
          where: {
            name: data
          }
        });
        const plugin = item.dataValues;
        const { view, load } = createPlugin(plugin);
        if (plugin.separation) {
          return createSeparate(plugin, view);
        } else {
          return await mainBrowser.openPlugin(plugin, view, load);
        }
      default:
        break;
    }
  });

  ipcMain.on(EVENT_MESSENGER, (event, { type, data }) => {
    switch (type) {
      case 'setExpendHeight':
        mainBrowser.setExpendHeight(data);
        break;
      case 'separationWindow':
        mainBrowser.separationWindow();
        break;
      case 'closePlugin':
        mainBrowser.closePlugin();
        break;
      default:
        break;
    }
  });


  ipcMain.handle(DEVELOPER_MESSAGE, async (event, { type, data }) => {
    if (type === 'create'){
      const plugin = await Plugins.create({
        type:'plugin-dev',
        ...data
      },{
        returning: true,
      });
      return plugin;
    }
    switch (type) {
      case 'create':
      case 'update':
        const item = await Plugins.findOne({
          where: {
            name: data.name
          }
        });
        const plugin = item.dataValues;
        await Plugins.update(data, {
          where: {
            name: plugin.name
          }
        });
        return plugin;
      case 'delete':
        const item = await Plugins.findOne({
          where: {
            name: data
          }
        });
        const plugin = item.dataValues;
        await Plugins.destroy({
          where: {
            name: plugin.name
          }
        });
        return plugin;
      default:
        break;
    }
  })
}
