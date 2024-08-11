import { nativeTheme } from 'electron';
import { DEFAULT_SETTINGS_KEY } from '@config/constants';
import defaultSettings from '@config/settings';
import systemPluginList from '@config/plugins';
import store from '@main/utils/store';

import SettingsModal from '@main/modal/settings';
import PluginsModal from '@main/modal/plugins';

export default async function initialization() {
  const [settings] = await SettingsModal.findOrCreate({
    where: {
      type: DEFAULT_SETTINGS_KEY
    },
    attributes: [
      'theme',
      'colorPrimary',
      'start',
      'guide',
      'language',
      'placeholder'
    ],
    defaults: defaultSettings
  });
  await PluginsModal.destroy({
    where: {
      type: 'built'
    }
  });
  await PluginsModal.bulkCreate(systemPluginList);

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
