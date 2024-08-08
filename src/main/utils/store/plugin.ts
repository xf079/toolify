import { BaseWindow, WebContentsView } from 'electron';

interface IPluginState {
  // 唯一标识
  unique: string;
  // 插件信息
  plugin: IPlugin;
  // 插件是否多开
  single: boolean;
  // 是否自动分离为单独窗口
  separation: boolean;
  // 插件视图
  view: { view: WebContentsView; id: number }[];
}

class PluginStore {
  /**
   * 当前打开的插件列表
   */
  private pluginList: IPluginState[] = [];

  /**
   * 当前插件窗口是否打开
   * @param plugin
   * @return Boolean
   */
  isSelfPluginOpen(plugin: IPlugin) {
    // 如果设置了多开，并且自动分离为独立窗口 则返回false
    if (plugin.single && plugin.separation) {
      return false;
    }
    const item = this.pluginList.find((item) => item.unique === plugin.unique);
    return !!item;
  }

  /**
   * 查找插件
   * @param unique
   * @return
   */
  findPlugin(unique: string) {
    return this.pluginList.find((item) => item.unique === unique);
  }

  /**
   * 查找插件索引位置
   * @param unique
   */
  findPluginIndex(unique: string) {
    return this.pluginList.findIndex((item) => item.unique === unique);
  }

  /**
   * 添加插件
   * @param winId
   * @param plugin
   * @param view
   */
  addPlugin(plugin: IPlugin, view: WebContentsView, winId?: number) {
    const currentPluginIndex = this.findPluginIndex(plugin.unique);
    if (currentPluginIndex !== -1) {
      this.pluginList[currentPluginIndex].view.push({ view: view, id: winId });
    } else {
      this.pluginList.push({
        unique: plugin.unique,
        plugin: plugin,
        single: plugin.single,
        separation: plugin.separation,
        view: [{ view: view, id: winId }]
      });
    }
  }

  /**
   * 卸载插件
   * @param unique
   */
  destroyPlugin(unique: string) {
    this.pluginList = this.pluginList.filter((item) => item.unique !== unique);
  }
}

const pluginStore = new PluginStore();

export default pluginStore;
