export {};

declare global {
  type Recordable = Record<string, any>;

  /**
   * 系统设置信息
   */
  interface ISettings {
    theme: string;
    colorPrimary: string;
    start: boolean;
    placeholder: string;
  }

  // ai 工具
  interface IAi {
    id: number;
    name: string;
    main: string;
    logo: string;
    description: string;
    [key: string]: any;
  }

  // 系统app
  interface IApp {
    id: number;
    name: string;
    main: string;
    logo: string;
    description: string;
    [key: string]: any;
  }

  // 插件
  interface IPlugin {
    id: number;
    // 'built' | 'plugin-prod' | 'plugin-dev'
    type: string;
    name: string;
    main: string;
    logo: string;
    description?: string;
    separation?: boolean;
    single?: boolean;
    autoUninstalled?: boolean;
    unique?: string;
    version?: string;
    platform?: string;
    [key: string]: any;
  }

  // 插件快捷指令
  interface IFeatures {
    id: number;
    [key: string]: any;
  }

  // 开发者插件
  interface IDeveloper {
    id: number;
    unique: string;
    name: string;
    main: string;
    logo: string;
    description: string;
    homepage: string;
    source: string;
    running: boolean;
    message: string;
    [key: string]: any;
  }

  interface IMore {
    label: string;
    type: 'more';
    [key: string]: any;
  }

  // 搜索结果类型
  type ISearchResult = {
    pluginList: IPlugin[];
    appList: IApp[];
    developerList: IDeveloperPlugin[];
    featuresList: IFeatures[];
    aiList: IDeveloperPlugin[];
  };

  type IResultEnumType = 'app' | 'plugin' | 'developer' | 'features' | 'ai';
  type IResultType = IApp | IPlugin | IAi | IDeveloper | IFeatures;

  interface IGroupType {
    /**
     * 分组类型
     */
    type: IResultEnumType;
    /**
     * 分组名称
     */
    label: string;
    /**
     * 排序
     */
    orderBy: number;
    /**
     * 隐藏时最大显示数量
     */
    maxDisplayedNumber: number;
    /**
     * 是否显示更多
     */
    showDisplayed: boolean;
    /**
     * 当前分组显示的列表
     */
    children: IResultType[];
    /**
     * 当前分组所有列表
     */
    origin: IResultType[];
    /**
     * 展示更多组件
     */
    more: IMore;
  }
}
