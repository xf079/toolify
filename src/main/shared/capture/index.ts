import { screen, desktopCapturer,BrowserWindow } from 'electron';
import path from 'node:path';


export function capture() {
  return new Promise(async (resolve, reject) => {
    const displays = screen.getAllDisplays()
    displays.forEach((display,index) => {
      const win = new BrowserWindow({
        x: display.bounds.x,
        y: display.bounds.y,
        width: display.bounds.width,
        height: display.bounds.height,
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
      })
      if(SCREENSHOT_WINDOW_VITE_DEV_SERVER_URL){
        win.loadURL(SCREENSHOT_WINDOW_VITE_DEV_SERVER_URL)
        win.webContents.openDevTools()
      }else{
        win.loadURL(SCREENSHOT_WINDOW_VITE_NAME)
      }
      win.webContents.on('ipc-message-sync', (event, channel, data) => {
        if (channel === 'capture-source') {
          desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: {
              width: display.bounds.width,
              height: display.bounds.height
            }
          }).then((sources) => {
            const source = sources[index];
            event.returnValue = source.thumbnail.toDataURL();
            win.setAlwaysOnTop(true,'pop-up-menu',1)
            win.show();
          })
        }
      })
      require('@electron/remote/main').enable(win.webContents);
    })
  });
}
