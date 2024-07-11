import { contextBridge, ipcRenderer } from 'electron';

const apeakExpose: IMainEvent = {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  trigger(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    console.log(channel, ...omit);
    return ipcRenderer.send(channel, ...omit);
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  sync(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  }
};

contextBridge.exposeInMainWorld('apeak', apeakExpose);
