import { nativeTheme } from 'electron';
import { DEFAULT_CONFIG, SYSTEM_PLUGIN_LIST } from '@main/config/defaultConfig';
import { CONFIG_DEFAULT_TYPE } from '@main/config/constants';
import SettingsModal from '@main/modal/settings';
import PluginsModal from '@main/modal/plugins';
import store from '@main/utils/store';

export default async function initialization() {
  const [settings] = await SettingsModal.findOrCreate({
    where: {
      type: CONFIG_DEFAULT_TYPE
    },
    defaults: DEFAULT_CONFIG
  });
  await PluginsModal.destroy({
    where: {
      type: 'built'
    }
  });
  await PluginsModal.bulkCreate(SYSTEM_PLUGIN_LIST);

  const settingsValues = settings.dataValues;

  store.setConfig(settingsValues);

  if (settingsValues.theme === 'system') {
    store.setBackgroundColor(
      nativeTheme.shouldUseDarkColors ? '#000000' : '#FFFFFF'
    );
  } else {
    store.setBackgroundColor(
      settingsValues.theme === 'dark' ? '#000000' : '#FFFFFF'
    );
  }

  nativeTheme.on('updated', () => {
    store.setBackgroundColor(
      nativeTheme.shouldUseDarkColors ? '#000000' : '#FFFFFF'
    );
  });
}
