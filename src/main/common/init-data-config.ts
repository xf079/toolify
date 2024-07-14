import ThemeModal from '@main/shared/db/modal/theme';
import SettingsModal from '@main/shared/db/modal/settings';
import PluginsModal from '@main/shared/db/modal/plugins';
import { defaultConfig } from '@common/config/default-config';

export default async function initDefaultConfig() {
  try {

    const theme = await ThemeModal.findOne({
      where: {
        type: 'default'
      }
    });

    const settings = await SettingsModal.findOne({
      where: {
        type: 'default'
      }
    });


    const plugins = await ThemeModal.findAll({
      where: {
        type: 'system'
      }
    });

    if (!theme) {
      await ThemeModal.create(defaultConfig.theme);
    }

    if (!settings) {
      await SettingsModal.create(defaultConfig.settings);
    }

    if (!plugins.length) {
      await PluginsModal.bulkCreate(defaultConfig.plugins);
    }
  }catch (error){
    console.log(error);
  }
}
