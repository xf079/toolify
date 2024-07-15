import { spawn } from 'node:child_process';
import { IApplication } from '@common/types';
import { nativeImage } from 'electron';
import { getDataPath } from '@common/utils/os';
import fs from 'node:fs';

export class MacosApplication {
  async init() {
    return await this.getApps();
  }

  private profilerShell() {
    return new Promise<string>((resolve) => {
      const systemProfiler = spawn('system_profiler', [
        'SPApplicationsDataType'
      ]);
      let chunks = '';
      systemProfiler.stdout.on('data', (chunk) => {
        chunks += chunk;
      });
      systemProfiler.on('close', () => {
        resolve(chunks);
      });
    });
  }

  getSystemPanes() {
    const path = '/System/Library/PreferencePanes';
    return fs.readdirSync(path).map((file) => {
      return {
        name: file.split('.')[0],
        target: path + '/' + file,
        icon: '',
        type: 'application'
      };
    });
  }

  formatStringToArrayObj(str: string) {
    // 按行分割输出，并去除空行
    const lines = str.split('\n').filter((line) => line.trim() !== '');
    const list: Recordable[] = [];
    let item: Recordable = {};
    lines.forEach((line, index) => {
      const lineArr = line.split(':');
      if (lineArr.length === 2) {
        const lineValue = lineArr[1].trim();
        if (lineValue !== '') {
          item[lineArr[0].trim()] = lineValue;
        } else {
          if (index !== 0) {
            list.push(item);
            item = {};
          }
          item['name'] = (lineArr[0] || '').trim();
        }
      }
    });
    return list
      .filter((item) => item.name && item.Location)
      .map((item) => ({
        icon: '',
        name: item.name,
        target: item.Location,
        type: 'application'
      }));
  }

  async getApplicationDetail(item: IApplication) {
    try {
      const image = await nativeImage.createThumbnailFromPath(item.target, {
        width: 48,
        height: 48
      });
      /**
       * 没有读取到icon文件
       */
      if (image.isEmpty()) {
        return null;
      }
      const dataBuffer = image.toPNG();
      const iconPath = getDataPath('/image/' + item.name + '.png');
      fs.writeFileSync(iconPath, dataBuffer);
      return {
        ...item,
        icon: iconPath
      };
    } catch (error) {
      console.log(error);
    }
    return item;
  }

  async getApps() {
    return new Promise<IApplication[]>(async (resolve) => {
      const appData = await this.profilerShell();

      const appList = this.formatStringToArrayObj(appData);
      const panesList = this.getSystemPanes();

      const appPromises = appList.map(this.getApplicationDetail);
      const panesPromises = panesList.map(this.getApplicationDetail);
      Promise.all([...appPromises, ...panesPromises]).then((data) => {
        resolve(data.filter(Boolean));
      });
    });
  }
}
