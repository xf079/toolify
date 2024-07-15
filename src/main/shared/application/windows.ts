import { app, shell } from 'electron';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import iconv from 'iconv-lite';
import {
  copyFile,
  getDataPath,
  getFilenameWithoutExtension
} from '@common/utils/os';
import { IApplication } from '@common/types';

export class WindowsApplication {
  async init() {
    return await this.getApps();
  }

  /**
   * 使用 powershell 获取app列表
   * @param cmd
   */
  private powershell(cmd: string) {
    return new Promise<any>((resolve) => {
      const ps = spawn('powershell', ['-NoProfile', '-Command', cmd], {});
      const chunks: string[] = [];
      ps.stdout.on('data', (chunk) => {
        chunks.push(iconv.decode(chunk, 'cp936'));
      });
      ps.on('close', () => {
        const stdout = chunks.join('');
        resolve(stdout);
      });
    });
  }

  private formatPathsToObjects(pathsText: string): string[] {
    const lines = pathsText.split('\n').filter((line) => line.trim() !== '');
    const pathObjects: string[] = [];

    for (const line of lines) {
      if (line.startsWith('Name')) continue;
      pathObjects.push(line.trim());
    }

    return pathObjects;
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
            icon: iconPath,
            name: fileName,
            target: detail.target,
            type: 'application'
          };
        } else {
          const iconPath = getDataPath('/image/' + fileName + '.ico');
          copyFile(detail.icon, iconPath);
          return {
            icon: iconPath,
            name: fileName,
            target: detail.target,
            type: 'application'
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
   * 获取app列表
   * @private
   */
  private getApps() {
    return new Promise<IApplication[]>(async (resolve) => {
      const stdout = await this.powershell(
        'Get-CimInstance Win32_ShortcutFile | select Name'
      );
      const list: string[] = this.formatPathsToObjects(stdout);
      const appPromises = list.map(this.getApplicationDetail);
      Promise.all(appPromises).then((data) => {
        resolve(data.filter(Boolean));
      });
    });
  }
}
