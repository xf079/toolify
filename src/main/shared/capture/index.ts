import { screen, BrowserWindow } from 'electron';
import path from 'node:path';
import screenshot from 'screenshot-desktop';

interface ICaptureWindowOptions {
  display: Electron.Display;
  source: Buffer;
  resolve: (value: string) => void;
  reject: (reason: string) => void;
}

function createCaptureWindow(options: ICaptureWindowOptions) {
  const { display, source, resolve, reject } = options;
  const win = new BrowserWindow({
    x: display.bounds.x,
    y: display.bounds.y,
    width: display.bounds.width,
    height: display.bounds.height,
    resizable: false,
    fullscreen: true,
    frame: false,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, '../preload/index.js')
    }
  });
  if (SCREENSHOT_WINDOW_VITE_DEV_SERVER_URL) {
    void win.loadURL(SCREENSHOT_WINDOW_VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    void win.loadURL(SCREENSHOT_WINDOW_VITE_NAME);
  }
  win.webContents.on('ipc-message-sync', (event, channel) => {
    if (channel === 'capture-source') {
      event.returnValue = 'data:image/jpeg;base64,' + source.toString('base64');
    }
  });
  win.webContents.on('ipc-message', (event, channel, data) => {
    if (channel === 'capture-show') {
      win.setAlwaysOnTop(true, 'pop-up-menu', 1);
      win.show();
    }
    if (channel === 'capture-close') {
      reject('User closed the window');
      win.close();
    }
    if (channel === 'capture-done') {
      resolve(data);
      win.close();
    }
  });
  require('@electron/remote/main').enable(win.webContents);
}

export function capture() {
  return new Promise(async (resolve, reject) => {
    const displays = screen.getAllDisplays();
    const screenList = await screenshot.all();
    displays.forEach((display, index) => {
      createCaptureWindow({
        display,
        source: screenList[index] as unknown as Buffer,
        resolve,
        reject
      });
    });
  });
}
