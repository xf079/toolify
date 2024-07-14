import { IBrowserWindow } from '@common/types';
import { BrowserWindow } from 'electron';

export class DetachBrowser implements IBrowserWindow {
  win: BrowserWindow;
  constructor() {
  }
  private init() {
    // TODO
  }

  private createWindow(){

  }

  getWindow() {
    return this.win;
  }
}
