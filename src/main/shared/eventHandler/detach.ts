import { BaseWindow, ipcMain } from 'electron';

export function detachEventHandler(){

  ipcMain.on('detach:service',(event,args)=>{
    const windows = BaseWindow.getAllWindows();
    console.log(windows);
  })
}