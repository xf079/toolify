import PluginsModal from '@main/modal/plugins';
import { match } from 'pinyin-pro';
import store from 'src/main/utils/store';

/**
 * 搜索
 * @param value
 */
export const onSearch = async (value: string) => {
  const pluginList = await PluginsModal.findAll();
  if (pluginList && pluginList.length) {
    const list = pluginList.map((item) => item.dataValues);
    const resultList: IPlugin[] = [];
    list.forEach((item: IPlugin) => {
      const indexList = match(item.name, value, {
        continuous: true,
        precision: 'every'
      });
      if (!(indexList || []).length) return;

      const nameList = item.name.split('');
      const nameFormat = nameList.map((val, index) => {
        if ((indexList || []).includes(index)) {
          return `<span style="color: ${store.getConfig().colorPrimary}">${val}</span>`;
        }
        return val;
      });
      resultList.push({ ...item, nameFormat: nameFormat.join('') });
    });
    return resultList;
  }
  return [];
};
