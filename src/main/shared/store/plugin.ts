import { WebContentsView } from 'electron';

interface IPluginState {
  plugin: IPlugin;
  view: WebContentsView;
  id: number;
}

class PluginStore {
  /**
   * 当前打开的插件列表
   */
  private pluginList: IPluginState[];
  /**
   * 当前打开插件
   * @private
   */
  private plugin: number;

  /**
   * 获取当前插件
   */
  getSelfPlugin() {
    const item = this.pluginList.find((item) => item.id === this.plugin);
    if (item) {
      return item.plugin;
    } else {
      return false;
    }
  }

  /**
   * 当前窗口是否打开
   * @param plugin
   * @return Boolean
   */
  isSelfPluginOpen(plugin: IPlugin) {
    // 如果设置了多开，则返回false
    if (plugin.single) {
      return false;
    }
    const item = this.pluginList.find((item) => item.plugin.id === plugin.id);
    return !!item;
  }

  /**
   * 添加插件
   * @param plugin
   * @param view
   */
  openPlugin(plugin: IPlugin, view: WebContentsView) {
    const hasPlugin = this.findPlugin(plugin.id);
    if (!hasPlugin || hasPlugin.plugin.single) {
      this.pluginList.push({
        plugin,
        view,
        id: plugin.id
      });
    }
    // 是否自动分离独立窗口
    if (!plugin.separation) {
      // 不分离是才设置当前插件信息
      this.plugin = plugin.id;
    }
  }

  /**
   * 关闭插件
   * @param id
   */
  closePlugin(id: number) {
    this.plugin = undefined;
    const currentPlugin = this.findPlugin(id);
    /**
     * 设置自动卸载
     */
    if (currentPlugin && currentPlugin.plugin.autoUninstalled) {
      this.removePlugin(id);
    }
  }

  /**
   * 移除插件
   * @param id
   */
  removePlugin(id: number) {
    this.pluginList = this.pluginList.filter((item) => item.id !== id);
  }

  /**
   * 查找插件
   * @param id
   * @return
   */
  findPlugin(id: number) {
    return this.pluginList.find((item) => item.id === id);
  }
}

const pluginStore = new PluginStore();

export default pluginStore;
