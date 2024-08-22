import { nativeTheme } from 'electron';
import { DEFAULT_SETTINGS_KEY } from '@config/constants';
import defaultSettings from '@config/settings';
import systemPluginList from '@config/plugins';
import store from '@main/utils/store';
import aiList from '@config/ai';

import Settings from '@main/modal/settings';
import Plugins from '@main/modal/plugins';
import Ai from '@main/modal/ai';

export default async function initialization() {
  const [settings] = await Settings.findOrCreate({
    where: {
      type: DEFAULT_SETTINGS_KEY
    },
    attributes: ['theme', 'colorPrimary', 'start', 'placeholder'],
    defaults: defaultSettings
  });
  await Plugins.destroy({
    where: {
      type: 'built'
    }
  });
  await Plugins.bulkCreate(systemPluginList);
  await Ai.bulkCreate(aiList, {
    ignoreDuplicates: true
  });

  const settingsValues = settings.dataValues;

  store.setSettings(settingsValues);

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
