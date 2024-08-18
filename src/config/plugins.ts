import {
  SYSTEM_DEVELOPER,
  SYSTEM_PLUGIN_CENTER,
  SYSTEM_PLUGIN_SETTINGS
} from './constants';
import { getPublicPluginIcon } from '@main/utils/fs';

const systemPluginList = [
  {
    type: 'system',
    name: '插件中心',
    main: SYSTEM_PLUGIN_CENTER,
    logo: getPublicPluginIcon('plugins-icon'),
    description: 'Toolify 插件中心'
  },
  {
    type: 'system',
    name: '系统设置',
    main: SYSTEM_PLUGIN_SETTINGS,
    logo: getPublicPluginIcon('settings-icon'),
    description: 'Toolify 系统设置'
  },
  {
    type: 'system',
    name: '开发者中心',
    main: SYSTEM_DEVELOPER,
    logo: getPublicPluginIcon('developer-icon'),
    description: '开发Toolify插件应用'
  }
];

export const SYSTEM_PLUGIN_ENTER_ENUM = {
  [SYSTEM_PLUGIN_CENTER]:
    PLUGINS_WINDOW_VITE_DEV_SERVER_URL || PLUGINS_WINDOW_VITE_NAME,
  [SYSTEM_PLUGIN_SETTINGS]:
    SETTINGS_WINDOW_VITE_DEV_SERVER_URL || SETTINGS_WINDOW_VITE_NAME,
  [SYSTEM_DEVELOPER]:
    DEVELOPER_WINDOW_VITE_DEV_SERVER_URL || DEVELOPER_WINDOW_VITE_NAME
};

export default systemPluginList;
