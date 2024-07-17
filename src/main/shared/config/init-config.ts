import ThemeModal from '@main/shared/db/modal/theme';
import SettingsModal from '@main/shared/db/modal/settings';
import PluginsModal from '@main/shared/db/modal/plugins';
import { defaultConfig } from '@common/config/default-config';

export default async function initDefaultConfig() {
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
      type: 'system'
    }
  });
  await PluginsModal.bulkCreate(defaultConfig.plugins);
}
