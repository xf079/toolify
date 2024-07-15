import pinyin from 'pinyin';

export const getThemeConfig = () => ({
  type: 'default',
  theme: 'system',
  compact: false,
  colorPrimary: '#e12160'
});

export const getSettingsConfig = () => ({
  type: 'default',
  start: false,
  guide: false,
  language: 'zh-CN',
  searchMode:'list',
  placeholder: '输入关键词搜索'
});

export const getPluginsConfig = () => ([
  {
    type: 'system',
    name: '插件中心',
    pinYinName: pinyin('插件中心', {
      style: pinyin.STYLE_NORMAL,
      heteronym: true
    }).toString(),
    desc: '插件中心',
    version: '1.0.0',
    logo: 'https://img.zcool.cn/community/0180b65af0400aa801219b7fe7ee6b.png@1280w_1l_2o_100sh.png',
    platform: 'all',
    single: false,
    height: 600,
    features: ''
  },
  {
    type: 'system',
    name: '个人中心',
    pinYinName: pinyin('个人中心', {
      style: pinyin.STYLE_NORMAL,
      heteronym: true
    }).toString(),
    desc: '个人中心',
    version: '1.0.0',
    logo: 'https://bpic.588ku.com/element_origin_min_pic/19/04/10/3e2240094a917067f1472192a58aefd1.jpg',
    platform: 'all',
    single: false,
    height: 600,
    features: ''
  }
])

export const defaultConfig = {
  theme: getThemeConfig(),
  settings: getSettingsConfig(),
  plugins: getPluginsConfig()
};


export type ThemeConfigType = ReturnType<typeof getThemeConfig>

export type SettingsConfigType = ReturnType<typeof getSettingsConfig>

export type PluginsConfigType = ReturnType<typeof getPluginsConfig>[0]
