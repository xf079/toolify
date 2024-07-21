import { SYSTEM_PLUGIN_CENTER, SYSTEM_PLUGIN_SETTINGS } from '@main/config/constants';

export const getThemeConfig = () => ({
  type: 'default',
  theme: 'system',
  compact: false,
  colorPrimary: '#12B76A'
});

export const getSettingsConfig = () => ({
  type: 'default',
  start: false,
  guide: false,
  language: 'zh-CN',
  placeholder: 'Hi, Apeak'
});

export const pluginCenter = {
  unique: SYSTEM_PLUGIN_CENTER,
  type: 'built',
  name: '插件中心',
  main: '/system/plugins',
  logo: 'https://img.zcool.cn/community/0180b65af0400aa801219b7fe7ee6b.png@1280w_1l_2o_100sh.png',
  desc: 'Apeak 插件中心'
};

export const systemSettings = {
  unique:SYSTEM_PLUGIN_SETTINGS,
  type: 'built',
  name: '系统设置',
  main: '/system/settings',
  logo: 'https://bpic.588ku.com/element_origin_min_pic/19/04/10/3e2240094a917067f1472192a58aefd1.jpg',
  desc: 'Apeak 系统设置'
};

export const getPluginsConfig = () => [
  pluginCenter,
  systemSettings,
  {
    type: 'built',
    name: '开发者中心',
    main: '/system/developer',
    logo: 'https://img.zcool.cn/community/0180b65af0400aa801219b7fe7ee6b.png@1280w_1l_2o_100sh.png',
    desc: '开发Apeak插件应用'
  }
];

export const defaultConfig = {
  theme: getThemeConfig(),
  settings: getSettingsConfig(),
  plugins: getPluginsConfig()
};

export type ThemeConfigType = ReturnType<typeof getThemeConfig>;

export type SettingsConfigType = ReturnType<typeof getSettingsConfig>;
