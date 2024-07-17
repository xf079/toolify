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
  placeholder: '输入关键词搜索'
});

export const getPluginsConfig = () => ([
  {
    type: 'system',
    name: '插件中心',
    main:'/system/plugins',
    logo: 'https://img.zcool.cn/community/0180b65af0400aa801219b7fe7ee6b.png@1280w_1l_2o_100sh.png',
    desc: '插件中心'
  },
  {
    type: 'system',
    name: '个人中心',
    main:'/system/mine',
    logo: 'https://bpic.588ku.com/element_origin_min_pic/19/04/10/3e2240094a917067f1472192a58aefd1.jpg',
    desc: '个人中心'
  }
])

export const defaultConfig = {
  theme: getThemeConfig(),
  settings: getSettingsConfig(),
  plugins: getPluginsConfig()
};


export type ThemeConfigType = ReturnType<typeof getThemeConfig>

export type SettingsConfigType = ReturnType<typeof getSettingsConfig>
