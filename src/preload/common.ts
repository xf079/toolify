import {
  dialog,
  Menu,
  shell,
  nativeImage,
  desktopCapturer
} from '@electron/remote';
import os from 'node:os';

type ISync = (type: string, data?: any) => Promise<any>;
type ISend = (type: string, data?: any) => void;

export function genCommonToolify(sync: ISync, send: ISend) {
  return {
    /**
     * 生命周期
     * 插件进入
     * @param cb
     */
    onPluginEnter(cb) {
      typeof cb === 'function' && (window.__hooks__.onPluginEnter = cb);
    },
    /**
     * 生命周期
     * 插件加载完成
     * @param cb
     */
    onPluginReady(cb) {
      typeof cb === 'function' && (window.__hooks__.onPluginReady = cb);
    },
    /**
     * 生命周期
     * 插件退出
     * @param cb
     */
    onPluginOut(cb) {
      typeof cb === 'function' && (window.__hooks__.onPluginOut = cb);
    },

    /**
     * 是否暗色模式
     */
    isDarkColor() {
      return false;
    },

    /**
     * 设置主题
     * @param theme
     */
    setTheme(theme: ITHeme) {},
    /**
     * 显示主窗口
     */
    showMainWindow() {},
    /**
     * 隐藏主窗口
     */
    hideMainWindow() {},

    /**
     * 设置主窗口区域高度
     * @param height
     */
    setExpendHeight(height) {
      send('setExpendHeight', height);
    },
    /**
     * 设置插件窗口输入框
     * @param options
     */
    setupSecondaryField(options: IFieldOptions) {},

    /**
     * 打开文件选择弹窗
     * @param options
     */
    showOpenDialog: async (options) => {
      return await dialog.showOpenDialog(options);
    },

    /**
     * 显示菜单
     * @param options
     * @param popupOptions
     */
    showOpenMenu: (options = [], popupOptions = {}) => {
      const menu = Menu.buildFromTemplate(options);
      menu.popup(popupOptions);
    },

    /**
     * 弹出文件保存弹窗
     * @param options
     */
    showSaveDialog: (options) => {
      return dialog.showSaveDialogSync(options);
    },
    // ------- tools 工具
    screenColorPick(func) {},
    screenCapture(func) {
      sync('screenCapture').then(data=>{
        func(data)
      })
    },

    // ------ system 系统 ------------
    /**
     * 显示系统通知
     * @param body 通知内容
     * @param featureCode 点击回到关键字
     */
    showNotification(body: string, featureCode?: string) {
      send(body, featureCode);
    },

    /**
     * 系统默认方式打开指定文件
     * @param fullPath
     */
    shellOpenPath: async (fullPath: string) => {
      return await shell.openPath(fullPath);
    },

    /**
     * 删除文件至回收站
     * @param filename
     */
    shellTrashItem(filename) {
      return new Promise((resolve) => {});
    },

    /**
     * 系统文件管理器中显示指定文件
     * @param fullPath
     */
    shellShowItemInFolder(fullPath) {},

    /**
     * 系统默认协议打开URL
     * @param url
     */
    shellOpenExternal(url) {
      return shell.openExternal(url);
    },

    /**
     * 播放系统哔哔声
     */
    shellBeep() {},

    /**
     * 获取插件名称
     */
    getAppName() {},

    /**
     * 获取插件版本
     */
    getAppVersion() {},

    /**
     *
     * @param name
     */
    getPath(name) {},

    /**
     * 创建nativeImage Icon
     * @param str png 的base64
     * @param options
     */
    createNativeImage(str, options) {
      const image = nativeImage.createFromDataURL(str);
      const imageBuffer = image.toPNG();
      return nativeImage.createFromBuffer(imageBuffer, options);
    },

    /**
     * 获取文件图标
     * @param filePath
     */
    getFileIcon(filePath) {},
    /**
     * 读取当前文件管理器窗口路径 (linux 不支持)
     */
    readCurrentFolderPath() {},
    /**
     * 读取当前浏览器窗口 URL (linux 不支持)
     */
    readCurrentBrowserUrl() {},

    /**
     * 断插件应用是否在开发环境
     */
    isDev() {},

    /**
     * 是否 MacOS 操作系统
     */
    isMacOs() {
      return os.type() === 'Darwin';
    },

    /**
     * 是否 Windows 操作系统
     */
    isWindows() {
      return os.type() === 'Windows_NT';
    },

    /**
     * 是否 Linux 操作系统
     */
    isLinux() {
      return os.type() === 'Linux';
    }
  } as ICommonEventHandler;
}
