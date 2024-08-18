export {};

declare global {
  type IFun = (...args: any[]) => any;
  type ITHeme = 'system' | 'light' | 'dark';

  interface IFieldOptions {
    onChange: (value: string) => void;
    placeholder?: string;
    focus?: boolean;
  }

  interface IMainEventHandler {
    /**
     * 搜索
     * @param value
     */
    search(value: string): Promise<any>;

    /**
     * 打开插件
     * @param name
     */
    openPlugin(name: string): Promise<boolean>;

    separationWindow(): void;

    /**
     * 关闭插件 - 后台仍在运行
     * @param destroy 是否卸载
     */
    closePlugin(destroy?: boolean): void;
  }

  interface ICommonEventHandler {
    onPluginEnter: (cb: IFun) => void;
    onPluginReady: (cb: IFun) => void;
    onPluginOut: (cb: IFun) => void;

    /**
     * 是否黑色主题
     */
    isDarkColor(): boolean;

    /**
     * 切换主题
     * @param theme
     */
    setTheme(theme: ITHeme): void;

    /**
     * 显示主窗口
     */
    showMainWindow(): void;

    /**
     * 隐藏主窗口
     */
    hideMainWindow(): void;

    /**
     * 修改主窗口插件内容高度
     * @param height
     */
    setExpendHeight(height: number): void;

    /**
     * 设置插件窗口输入框
     * @param options
     */
    setupSecondaryField(options: IFieldOptions): void;

    /**
     * 打开文件选择弹窗
     * @param option
     */
    showOpenDialog(
      option: Electron.OpenDialogOptions
    ): Promise<Electron.OpenDialogReturnValue>;

    /**
     * 显示菜单
     * @param options
     * @param popupOptions
     */
    showOpenMenu(
      options: Array<Electron.MenuItemConstructorOptions | Electron.MenuItem>,
      popupOptions?: Electron.PopupOptions
    ): void;

    /**
     * 弹出文件保存弹窗
     * @param options
     */
    showSaveDialog(options: Electron.SaveDialogOptions): string;

    // ------- tools 工具
    screenColorPick():Promise<{hex:string;rgb:string}>
    screenCapture():Promise<any[]>


    // ------ system 系统 ------------
    /**
     * 显示系统通知
     * @param body 通知内容
     * @param featureCode 点击回到关键字
     */
    showNotification(body: string, featureCode?: string): void;

    /**
     * 系统默认方式打开指定文件
     * @param fullPath
     */
    shellOpenPath(fullPath: string): Promise<string>;

    /**
     * 删除文件至回收站
     * @param filename
     */
    shellTrashItem(filename: string): Promise<void>;

    /**
     * 系统文件管理器中显示指定文件
     * @param fullPath
     */
    shellShowItemInFolder(fullPath: string): void;

    /**
     * 系统默认协议打开URL
     * @param url
     */
    shellOpenExternal(url: string): Promise<void>;

    /**
     * 播放系统哔哔声
     */
    shellBeep(): void;

    /**
     * 获取插件名称
     */
    getAppName(): string;

    /**
     * 获取插件版本
     */
    getAppVersion(): string;

    /**
     *
     * @param name
     */
    getPath(name: string): string;

    createNativeImage(
      str: string,
      options?: Electron.CreateFromBufferOptions
    ): Electron.NativeImage;

    getFileIcon(filePath: string): string;
    readCurrentFolderPath(): Promise<string>;
    readCurrentBrowserUrl(): Promise<string>;

    isDev(): boolean;
    isMacOs(): boolean;
    isWindows(): boolean;
    isLinux(): boolean;
  }

  interface Toolify extends IMainEventHandler, ICommonEventHandler {}

  interface Window {
    toolify: Toolify;
    __hooks__: Recordable;
  }
  declare const toolify: Toolify;
}
