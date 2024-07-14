import { app } from 'electron';
import fs from 'node:fs';

export function getDataPath(path: string) {
  const isPackaged = app.isPackaged;
  return isPackaged ? app.getPath('userData') + path : '.vite/build' + path;
}

/**
 * 创建文件夹
 * @param folderPath
 */
export function createFolderIfNotExists(folderPath: string) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

/**
 * 获取文件名
 * @param filePath
 */
export function getFilenameWithoutExtension(filePath: string) {
  const regex = /([^/\\]+)$/;
  const match = filePath.match(regex);
  const fileNameWithExtension = match ? match[1] : '';
  return fileNameWithExtension.replace(/\.\w+$/, '');
}

/**
 * 另类的copy文件
 * @param src
 * @param dest
 */
export function copyFile(src: string, dest: string) {
  const _buffer = fs.readFileSync(src);
  if (_buffer) {
    fs.writeFileSync(dest, _buffer);
  }
}
