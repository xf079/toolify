import { BaseWindow, dialog, ipcMain } from 'electron';
import {
  BUILD_IMPORT_PLUGIN,
  BUILT_CREATE_PLUGIN,
  BUILT_PLUGIN_LIST,
  BUILT_REMOVE_PLUGIN,
  BUILT_UPDATE_PLUGIN
} from '@main/config/constants';
import fs from 'node:fs';
import path from 'node:path';
import { isJsonFilePath } from '@main/utils/file';
import DeveloperModal from '@main/shared/modal/developer';
import { nanoid } from 'nanoid';

function validatePluginJson(json: Recordable, directory: string) {
  if (!json.logo) {
    return 'Logo配置缺失';
  } else {
    if (!fs.existsSync(path.resolve(directory, '.', json.logo))) {
      return 'Logo配置不存在';
    }
  }
  if (!json.entry) {
    return '插件入口配置缺失';
  } else {
    if (!fs.existsSync(path.resolve(directory, '.', json.entry))) {
      return '插件入口配置不存在';
    }
  }
}

export function initDeveloper(window: BaseWindow) {
  /**
   * 删除插件
   */
  ipcMain.handle(BUILT_REMOVE_PLUGIN, async (event, id) => {
    return await DeveloperModal.destroy({
      where: { id }
    });
  });

  /**
   * 更新插件信息
   */
  ipcMain.handle(BUILT_UPDATE_PLUGIN, async (event, data) => {
    return await DeveloperModal.update(data, {
      where: {
        id: data.id
      }
    });
  });

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
  ipcMain.handle(BUILT_CREATE_PLUGIN, (event, ...args) => {
    const filePath = dialog.showOpenDialogSync(window as any, {
      title: '选择插件位置',
      properties: ['openDirectory']
    });
    console.log(filePath);
  });

  /**
   * 导入插件
   */
  ipcMain.handle(BUILD_IMPORT_PLUGIN, async (event, ...args) => {
    const filePath = dialog.showOpenDialogSync(window as any, {
      title: '选择package.json',
      properties: ['openFile'],
      filters: [
        {
          name: 'package',
          extensions: ['json']
        }
      ]
    });
    if (!filePath) {
      return;
    }
    console.log(filePath);
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

    console.log(developer);
    if (developer) return { success: false, msg: '插件已存在' };

    // 插件目录
    const directory = path.resolve(pathStr, '..');

    const pluginData = fs.readFileSync(pathStr, 'utf8');
    if (pluginData) {
      try {
        const json = JSON.parse(pluginData);
        if (!json.name) {
          return { success: false, msg: '请配置name字段' };
        }
        const logo = path.resolve(directory, '.', json.logo);
        const main = path.resolve(directory, '.', json.entry);
        const res = await DeveloperModal.create({
          unique: nanoid(12),
          name: json.name || '',
          logo,
          main,
          homepage: json.homepage || '',
          description: json.description || '',
          source: directory,
          running: false
        });
        return {
          success: true,
          data: res.dataValues,
          msg: validatePluginJson(json, directory)
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          msg: '请选择正确的package.json文件'
        };
      }
    } else {
      return {
        success: false,
        msg: '请选择正确的package.json文件'
      };
    }
  });
}
