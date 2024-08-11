export {};

declare global {
  type IFun = (...args: any[]) => any;

  interface Toolify {
    onPluginEnter: (cb: IFun) => void;
    onPluginReady: (cb: IFun) => void;
    onPluginOut: (cb: IFun) => void;

    /**
     * 打开插件
     * @param name
     */
    choosePlugin(name: string): Promise<boolean>;

    /**
     * 获取配置文件
     */
    getSettings(): Promise<ISettings>;

    /**
     * 设置配置文件
     * @param settings
     */
    setSettings(settings: ISettings): void;

    showMainWindow(): void;
    hideMainWindow(): void;
  }

  interface Window {
    toolify: Toolify;
    __hooks__: Recordable;
  }
  declare const toolify: Toolify;
}
