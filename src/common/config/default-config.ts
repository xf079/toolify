import {
  CONFIG_GUIDE,
  CONFIG_LANGUAGE,
  CONFIG_PLACEHOLDER,
  CONFIG_PRIMARY_COLOR,
  CONFIG_START,
  CONFIG_THEME
} from '@common/constants/config-constants';

export const defaultConfig: Recordable = {
  [CONFIG_START]: false,
  [CONFIG_GUIDE]: false,
  [CONFIG_LANGUAGE]: 'zh-CN',
  [CONFIG_THEME]: 'system',
  [CONFIG_PRIMARY_COLOR]: '#1890ff',
  [CONFIG_PLACEHOLDER]: 'Hi, Apeak'
};
