import { nativeTheme } from 'electron';
import { DEFAULT_CONFIG, SYSTEM_PLUGIN_LIST } from '@main/config/defaultConfig';
import { CONFIG_DEFAULT_TYPE } from '@main/config/constants';
import SettingsModal from '@main/shared/modal/settings';
import PluginsModal from '@main/shared/modal/plugins';

export default async function initialization() {
  const [settings] = await SettingsModal.findOrCreate({
    where: {
      type: CONFIG_DEFAULT_TYPE
    },
    defaults: DEFAULT_CONFIG
  })
  await PluginsModal.destroy({
    where: {
      type: 'built'
    }
  })
  await PluginsModal.bulkCreate(SYSTEM_PLUGIN_LIST)

  const settingsValues = settings.dataValues;

  global.config = settingsValues

  if (settingsValues.theme === 'system') {
    global.bgColor = nativeTheme.shouldUseDarkColors ? '#000000' : '#FFFFFF';
  } else {
    global.bgColor = settingsValues.theme === 'dark' ? '#000000' : '#FFFFFF';
  }

  nativeTheme.on('updated', () => {
    global.bgColor = nativeTheme.shouldUseDarkColors ? '#000000' : '#FFFFFF';
  });
}
