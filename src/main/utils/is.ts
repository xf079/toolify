export const isProd = process.env.NODE_ENV === 'production';
export const isDev = process.env.NODE_ENV === 'development';

export const isTest = process.env.NODE_ENV === 'test';

export const isMac = process.platform === 'darwin';
export const isLinux = process.platform === 'linux';
export const isWindows = process.platform === 'win32';
