import { WebContentsView } from 'electron';
import path from 'node:path';
import store from '@main/utils/store';
import { isDev } from '@main/utils/is';
import pluginStore from '@main/utils/store/plugin';
import { SYSTEM_PLUGIN_ENTER_ENUM } from '@config/plugins';

/**
 * 创建系统插件窗口
 * @param plugin
 * @private
 */
function createSystemPluginView(plugin: IPlugin) {
  if (pluginStore.isSelfPluginOpen(plugin)) {
    const view = pluginStore.findPlugin(plugin.name).webView;
    return {
      view: view,
      load: true
    };
  }
  const pluginView = new WebContentsView({
    webPreferences: {
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      contextIsolation: false,
      zoomFactor: 1.0,
      preload: path.join(__dirname, '../preload/index.js')
    }
  });
  pluginView.setBackgroundColor(store.getBackgroundColor());
  const _main = plugin.main as keyof typeof SYSTEM_PLUGIN_ENTER_ENUM;
  if (isDev) {
    void pluginView.webContents.loadURL(SYSTEM_PLUGIN_ENTER_ENUM[_main]);
    pluginView.webContents.openDevTools();
  } else {
    void pluginView.webContents.loadFile(SYSTEM_PLUGIN_ENTER_ENUM[_main]);
  }
  require('@electron/remote/main').enable(pluginView.webContents);

  pluginStore.addPlugin(plugin, pluginView);

  return {
    view: pluginView,
    load: false
  };
}

/**
 * 创建三方插件
 * @private
 * @param plugin
 */
function createPluginView(plugin: IPlugin) {
  if (pluginStore.isSelfPluginOpen(plugin)) {
    const view = pluginStore.findPlugin(plugin.name).webView;
    return {
      view: view,
      load: true
    };
  }
  const pluginView = new WebContentsView({
    webPreferences: {
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      contextIsolation: false,
      zoomFactor: 1.0,
      preload: path.join(__dirname, '../preload/index.js')
    }
  });
  pluginView.setBackgroundColor(store.getBackgroundColor());
  const _main = plugin.main as keyof typeof SYSTEM_PLUGIN_ENTER_ENUM;
  if (isDev) {
    void pluginView.webContents.loadURL(SYSTEM_PLUGIN_ENTER_ENUM[_main]);
    pluginView.webContents.openDevTools();
  } else {
    void pluginView.webContents.loadFile(SYSTEM_PLUGIN_ENTER_ENUM[_main]);
  }
  require('@electron/remote/main').enable(pluginView.webContents);

  pluginStore.addPlugin(plugin, pluginView);

  return {
    view: pluginView,
    load: false
  };
}

export default function createPlugin(plugin: IPlugin) {
  if (plugin.type === 'system') {
    return createSystemPluginView(plugin);
  }
  return createPluginView(plugin);
}
