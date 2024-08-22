import { match } from 'pinyin-pro';
import store from '@main/utils/store';
import AppModal from '@main/modal/app';
import Plugins, { Cmd, Features } from '@main/modal/plugins';
import Ai from '@main/modal/ai';

/**
 * 搜索
 * @param value
 */
export const onSearch = async (value: string): Promise<ISearchResult> => {
  const pluginList = await Plugins.findAll({
    include: {
      model: Features,
      as: 'features',
      attributes: ['id', 'code', 'explain', 'icon', 'platform']
    }
  });
  const appList = await AppModal.findAll();
  const aiList = await Ai.findAll();
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
    pluginList: pluginList.map((item) => item.dataValues),
    aiList: aiList.map((item) => item.dataValues),
    appList: _appList
  };
};
