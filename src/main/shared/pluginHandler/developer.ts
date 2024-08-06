import { dialog, ipcMain } from 'electron';
import {
  BUILD_IMPORT_PLUGIN,
  BUILT_CREATE_PLUGIN,
  BUILT_PLUGIN_LIST,
  BUILT_REMOVE_PLUGIN,
  BUILT_UPDATE_PLUGIN
} from '@main/config/constants';
import fs from 'node:fs';
import path from 'node:path';
import { nanoid } from 'nanoid';
import DeveloperModal from '@main/modal/developer';
import mainBrowser from '@main/browser/main';

function isJsonFilePath(path:string) {
  const regex = /\.json$/i;
  return regex.test(path);
}

function readPluginJson(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      message: '插件文件不存在'
    };
  }
  // 插件目录
  const directory = path.resolve(filePath, '..');
  const pluginData = fs.readFileSync(filePath, 'utf8');

  try {
    const json = JSON.parse(pluginData);
    const logo = path.resolve(directory, '.', json.logo);
    const entry = path.resolve(directory, '.', json.entry);

    if (!json.name) {
      return {
        success: false,
        message: '配置文件name字段缺失'
      };
    }

    let message = '';

    if (!json.logo) {
      message = 'Logo配置缺失';
    } else {
      if (!fs.existsSync(logo)) {
        message = 'Logo配置不存在';
      }
    }
    if (!json.entry) {
      message = '插件入口配置缺失';
    } else {
      if (!fs.existsSync(entry)) {
        message = '插件入口配置不存在';
      }
    }

    return {
      success: true,
      data: {
        unique: nanoid(12),
        name: json.name || '',
        logo,
        main: entry,
        homepage: json.homepage || '',
        description: json.description || '',
        source: directory,
        running: false
      },
      message: message
    };
  } catch (error) {
    return {
      success: false,
      message: '插件配置格式有误'
    };
  }
}

export default function initDeveloper() {
  /**
   * 获取插件列表
   */
  ipcMain.handle(BUILT_PLUGIN_LIST, async () => {
    const res = await DeveloperModal.findAll();
    if (res && res.length > 0) {
      return res.map((item) => item.dataValues);
    }
    return [];
  });

  /**
   * 创建插件
   */
  ipcMain.handle(BUILT_CREATE_PLUGIN, async (event, arg) => {
    const [res, created] = await DeveloperModal.findOrCreate({
      where: {
        name: arg.name
      },
      defaults: arg
    });
    if (created) {
      return {
        success: true,
        data: res.dataValues
      };
    } else {
      return {
        success: false,
        msg: '插件已存在'
      };
    }
  });
  /**
   * 删除插件
   */
  ipcMain.handle(BUILT_REMOVE_PLUGIN, async (event, id) => {
    const status = await DeveloperModal.destroy({
      where: { id }
    });
    return {
      success: !!status,
      msg: status ? '更新成功' : '更新失败'
    };
  });

  /**
   * 更新插件信息
   */
  ipcMain.handle(BUILT_UPDATE_PLUGIN, async (event, data) => {
    const [status] = await DeveloperModal.update(data, {
      where: {
        id: data.id
      }
    });
    return {
      success: !!status,
      msg: status ? '更新成功' : '更新失败'
    };
  });

  /**
   * 导入插件
   */
  ipcMain.handle(BUILD_IMPORT_PLUGIN, async (event, ...args) => {
    const { main } = mainBrowser.getWindows();
    const filePath = dialog.showOpenDialogSync(main as any, {
      title: '选择package.json',
      properties: ['openFile'],
      filters: [
        {
          name: 'package',
          extensions: ['json']
        }
      ]
    });
    if (!filePath) return;
    const pathStr = filePath[0];
    if (!isJsonFilePath(pathStr)) {
      return { success: false, msg: '请选择正确的package.json文件' };
    }
    // 检查插件是否已经存在
    const developer = await DeveloperModal.findOne({
      where: {
        source: pathStr
      }
    });

    if (developer) return { success: false, msg: '插件已存在!' };

    const result = readPluginJson(pathStr);
    if (!result.success) {
      return result;
    }
    const res = await DeveloperModal.create(result.data);
    return {
      success: true,
      data: res.dataValues,
      msg: result.message
    };
  });
}
