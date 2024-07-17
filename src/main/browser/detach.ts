import { BrowserWindow } from 'electron';

class DetachBrowser{
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


const detachBrowser = new DetachBrowser();


export default detachBrowser;