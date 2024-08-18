import { WebContentsView } from 'electron';

interface IPluginState {
  name: string;
  // 插件信息
  plugin: IPlugin;
  // 插件是否多开
  single: boolean;
  // 是否自动分离为单独窗口
  separation: boolean;
  // 窗口id
  winId?: number;
  // 插件视图
  webView: WebContentsView;
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
    const item = this.pluginList.find((item) => item.name === plugin.name);
    return !!item;
  }

  /**
   * 查找插件
   * @param name
   * @return
   */
  findPlugin(name: string) {
    return this.pluginList.find((item) => item.name === name);
  }

  /**
   * 查找插件索引位置
   * @param name
   */
  findPluginIndex(name: string) {
    return this.pluginList.findIndex((item) => item.name === name);
  }

  /**
   * 添加插件
   * @param winId
   * @param plugin
   * @param view
   */
  addPlugin(plugin: IPlugin, view: WebContentsView, winId?: number) {
    this.pluginList.push({
      name: plugin.name,
      plugin: plugin,
      single: plugin.single,
      separation: plugin.separation,
      webView: view,
      winId: winId
    });
  }

  /**
   * 卸载插件
   * @param name
   */
  destroyPlugin(name: string) {
    this.pluginList = this.pluginList.filter((item) => item.name !== name);
  }
}

const pluginStore = new PluginStore();

export default pluginStore;
