import ThemeModal from '@main/shared/modal/theme';
import SettingsModal from '@main/shared/modal/settings';
import { defaultConfig } from '@main/config/defaultConfig';
import { nativeTheme } from 'electron';

export default async function initialization() {
  let theme: ThemeModal = await ThemeModal.findOne({
    where: {
      type: 'default'
    }
  });
  if (!theme) {
    await ThemeModal.create(defaultConfig.theme);
  }

  let settings = await SettingsModal.findOne({
    where: {
      type: 'default'
    }
  });
  if (!settings) {
    await SettingsModal.create(defaultConfig.settings);
  }


  theme = await ThemeModal.findOne({
    where: { type: 'default' }
  });

  settings = await SettingsModal.findOne({
    where: { type: 'default' }
  });

  const themeValues = theme.dataValues;
  const settingsValues = settings.dataValues;

  global.theme = themeValues;
  global.settings = settingsValues;
  global.configs = {
    theme: themeValues,
    settings: settingsValues
  };

  if (themeValues.theme === 'system') {
    global.bgColor = nativeTheme.shouldUseDarkColors ? '#000000' : '#FFFFFF';
  } else {
    global.bgColor = themeValues.theme === 'dark' ? '#000000' : '#FFFFFF';
  }

  nativeTheme.on('updated', () => {
    global.bgColor = nativeTheme.shouldUseDarkColors ? '#000000' : '#FFFFFF';
  });
}
