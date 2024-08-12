import { match } from 'pinyin-pro';
import store from '@main/utils/store';
import AppModal from '@main/modal/app';
import PluginsModal from '@main/modal/plugins';

/**
 * 搜索
 * @param value
 */
export const onSearch = async (value: string): Promise<ISearchResult> => {
  const pluginList = await PluginsModal.findAll();
  const appList = await AppModal.findAll();
  const _pluginList: IPlugin[] = [];
  const _appList: IApp[] = [];

  if (pluginList && pluginList.length) {
    const list = pluginList.map((item) => item.dataValues);
    list.forEach((item: IPlugin) => {
      const indexList = match(item.name, value, {
        continuous: true,
        precision: 'every'
      });
      if (!(indexList || []).length) return;

      const nameList = item.name.split('');
      const nameFormat = nameList.map((val, index) => {
        if ((indexList || []).includes(index)) {
          return `<span style="color: ${store.getSettings().colorPrimary}">${val}</span>`;
        }
        return val;
      });
      _pluginList.push({ ...item, nameFormat: nameFormat.join('') });
    });
  }

  if (appList && appList.length) {
    const list = appList.map((item) => item.dataValues);
    list.forEach((item: IApp) => {
      const indexList = match(item.name, value, {
        continuous: true,
        precision: 'every'
      });
      if (!(indexList || []).length) return;

      const nameList = item.name.split('');
      const nameFormat = nameList.map((val, index) => {
        if ((indexList || []).includes(index)) {
          return `<span style="color: ${store.getSettings().colorPrimary}">${val}</span>`;
        }
        return val;
      });
      _appList.push({ ...item, nameFormat: nameFormat.join('') });
    });
  }
  return {
    pluginList: _pluginList,
    aiList: [],
    featuresList: [],
    developerList: [],
    appList: _appList
  };
};
