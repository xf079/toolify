import { app, shell } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { unionBy } from 'lodash';
import {
  copyFile,
  getDataPath,
  getFilenameWithoutExtension
} from '@main/utils/os';

export class WindowsApplication {
  async init() {
    return await this.getApps();
  }

  /**
   * 获取app详情
   * @param path
   */
  private async getApplicationDetail(path: string) {
    try {
      if (path.indexOf('.lnk') === -1) {
        return null;
      }
      const detail = shell.readShortcutLink(path);
      const fileName = getFilenameWithoutExtension(path);
      if (detail.target) {
        if (detail.icon.indexOf('.ico') === -1) {
          const nativeImage = await app.getFileIcon(detail.target, {
            size: 'large'
          });
          /**
           * 没有读取到icon文件
           */
          if (nativeImage.isEmpty()) {
            return null;
          }
          const dataBuffer = nativeImage.toPNG();
          const iconPath = getDataPath('/image/' + fileName + '.png');
          fs.writeFileSync(iconPath, dataBuffer);
          return {
            type: 'app',
            name: fileName,
            main: detail.target,
            logo: iconPath
          };
        } else {
          const iconPath = getDataPath('/image/' + fileName + '.ico');
          copyFile(detail.icon, iconPath);
          return {
            type: 'app',
            name: fileName,
            main: detail.target,
            logo: iconPath
          };
        }
      }
      return null;
    } catch (error) {
      // console.log(error);
    }
    return null;
  }

  /**
   * 获取文件夹下所有文件
   * @param filePath
   * @private
   */
  private getFileDisplay(filePath: string) {
    const list: string[] = [];
    function getFiles(_filePath: string) {
      const files = fs.readdirSync(_filePath);
      files.forEach((file) => {
        const fileDir = path.join(_filePath, file);
        const stats = fs.statSync(fileDir);
        if (stats.isDirectory()) {
          getFiles(fileDir);
        } else {
          list.push(fileDir);
        }
      });
    }
    getFiles(filePath);
    return list;
  }

  /**
   * 获取app列表
   * @private
   */
  private getApps() {
    return new Promise<IPlugin[]>(async (resolve) => {
      const filePath = path.resolve(
        'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs'
      );
      const appData = path.join(os.homedir(), './AppData/Roaming');
      const startMenu = path.join(
        appData,
        'Microsoft\\Windows\\Start Menu\\Programs'
      );
      const programsList = this.getFileDisplay(filePath);
      const startList = this.getFileDisplay(startMenu);

      const programsPromises = programsList.map(this.getApplicationDetail);
      const startPromises = startList.map(this.getApplicationDetail);
      Promise.all([...programsPromises, ...startPromises]).then((data) => {
        resolve(
          unionBy(data.filter(Boolean), (item) => item.main.toLowerCase())
        );
      });
    });
  }
}
