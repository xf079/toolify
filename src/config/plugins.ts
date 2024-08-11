import {
  SYSTEM_DEVELOPER,
  SYSTEM_PLUGIN_CENTER,
  SYSTEM_PLUGIN_SETTINGS
} from './constants';
import { getPublicPluginIcon } from '@main/utils/fs';

const systemPluginList = [
  {
    unique: SYSTEM_PLUGIN_CENTER,
    type: 'built',
    name: '插件中心',
    main: PLUGINS_WINDOW_VITE_DEV_SERVER_URL || PLUGINS_WINDOW_VITE_NAME,
    logo: getPublicPluginIcon('plugins-icon'),
    desc: 'Apeak 插件中心'
  },
  {
    unique: SYSTEM_PLUGIN_SETTINGS,
    type: 'built',
    name: '系统设置',
    main: SETTINGS_WINDOW_VITE_DEV_SERVER_URL || SETTINGS_WINDOW_VITE_NAME,
    logo: getPublicPluginIcon('settings-icon'),
    desc: 'Apeak 系统设置'
  },
  {
    unique: SYSTEM_DEVELOPER,
    type: 'built',
    name: '开发者中心',
    main: DEVELOPER_WINDOW_VITE_DEV_SERVER_URL || DEVELOPER_WINDOW_VITE_NAME,
    logo: getPublicPluginIcon('developer-icon'),
    desc: '开发Apeak插件应用'
  }
];

export default systemPluginList;
