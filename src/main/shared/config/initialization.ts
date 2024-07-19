import ThemeModal from '@main/shared/modal/theme';
import SettingsModal from '@main/shared/modal/settings';
import PluginsModal from '@main/shared/modal/plugins';
import { defaultConfig } from '@main/config/default-config';

export default async function initialization() {
  await ThemeModal.destroy({
    where: {
      type: 'default'
    }
  });
  await ThemeModal.create(defaultConfig.theme);

  await SettingsModal.destroy({
    where: {
      type: 'default'
    }
  });
  await SettingsModal.create(defaultConfig.settings);

  await PluginsModal.destroy({
    where: {
      type: 'built'
    }
  });
  await PluginsModal.bulkCreate(defaultConfig.plugins);
}
