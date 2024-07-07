import { spawn } from 'node:child_process';
import iconv from 'iconv-lite';
import path from 'node:path';
import os from 'node:os';
import device from '@common/utils/device';
import fs from 'node:fs';

export interface IAppItem {
  DisplayName: string;
  DisplayIcon: string;
  UninstallString: string;
  DisplayVersion: string;
  InstallDate: string;
  Publisher: string;
  InstallLocation: string;
  LegalName: string;
  Icon: string;
  [key: string]: string;
}

function splitString(str: string) {
  const result = [];
  for (let i = 1; i <= str.length; i++) {
    result.push(str.substring(0, i));
  }
  return result;
}

function parseTableData(tableData) {
  const lines = tableData.trim().split('\n');
  const headers = lines[0].trim().split(/\s+/);
  const dataLines = lines.slice(2); // 跳过表头和分隔符行

  const result = dataLines.map((line) => {
    const values = line.trim().split(/\s+/);
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });

  return result;
}
class SystemApplication {
  async getAppList() {
    if (device.windows()) {
      return await this.winGetAppList2();
    }
    if (device.macOS()) {
      return await this.macGetAppList();
    }
    if (device.linux()) {
      return await this.linuxGetAppList();
    }
    return [];
  }

  /**
   * @param cmd
   * @param callback
   */
  private powershell(cmd: string, callback: (stdout: string) => void) {
    const ps = spawn('powershell', ['-NoProfile', '-Command', cmd], {});
    const chunks: string[] = [];
    ps.stdout.on('data', (chunk) => {

      chunks.push(iconv.decode(chunk, 'cp936'));
    });
    ps.on('close', () => {
      const stdout = chunks.join('');
      callback(stdout);
    });
  }

  winGetAppList(): Promise<IAppItem[]> {
    return new Promise((resolve) => {
      const filterValues =
        'Select-Object DisplayName,DisplayIcon,UninstallString,DisplayVersion,InstallDate,Publisher,InstallLocation | Format-Table DisplayName,DisplayIcon,UninstallString,DisplayVersion,InstallDate,Publisher,InstallLocation  -AutoSize';
      const localMatinee = `Get-ItemProperty HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | ${filterValues}`;
      const currentUser = `Get-ItemProperty HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | ${filterValues}`;
      const Wow6432Node = `Get-ItemProperty HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | ${filterValues}`;
      const x64 = process.arch == 'x64' ? `;${Wow6432Node}` : '';
      this.powershell(`${localMatinee};${currentUser}${x64}`, (stdout) => {
        const appList: IAppItem[] = [];
        console.log(stdout);
        const list = parseTableData(stdout);
        resolve(list);
        return;
        const apps = stdout
          .trim()
          .replace(/\r\n[ ]{10,}/g, '')
          .split('\r\n\r\n');
        console.log(apps);
        resolve(appList);
        for (const app of apps) {
          const dict: any = {};
          const lines = app.split('\r\n');
          for (const line of lines) {
            if (line) {
              const key = line.split(/\s+:\s*/)[0];
              dict[key] = line.split(/\s+:\s*/)[1];
            }
          }
          if (dict.DisplayName) {
            dict.LegalName = dict.DisplayName.replace(/[\\/:*?"<>|]/g, '');

            const nameList = splitString(dict.LegalName);
            for (let i = 0; i < nameList.length; i++) {
              try {
                const url = path.join(
                  os.tmpdir(),
                  'ProcessIcon',
                  `${nameList[i]}.png`
                );
                console.log(url);
                const s = fs.readFileSync(url);
                console.log(s);
                dict.Icon = url;
              } catch (error) {
                // console.log(error);
              }
            }
            appList.push(dict);
          }
        }
        resolve(appList);
      });
    });
  }

  winGetAppList2() {
    const query = '微信'
    return new Promise((resolve) => {
      this.powershell(`Get-ChildItem -Path C:\\\\ -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '*${query}*' } | Select-Object -First 10 FullName"`, (stdout) => {
        const packages = parseTableData(stdout);
        // packages.forEach((item: any) => {
        //   item.Icon = path.join(os.tmpdir(), 'ProcessIcon', `${item.Name}.png`);
        // });
        resolve(packages);
        // packages.forEach((item) => {
        //   this.powershell(`Get-AppxPackage -Name ${item.Name} | Format-Table -AutoSize`, (stdout) => {
        //     const appx = parseTableData(stdout);
        //     console.log(appx);
        //   })
        // });
      });
    });
  }
  macGetAppList(): Promise<IAppItem[]> {
    return new Promise((resolve) => {
      resolve([]);
    });
  }
  linuxGetAppList(): Promise<IAppItem[]> {
    return new Promise((resolve) => {
      resolve([]);
    });
  }
}

export default new SystemApplication();
