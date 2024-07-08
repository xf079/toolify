import iohook from 'iohook-raub';
import { mouse } from '@nut-tree/nut-js';
import { IWindow } from '@common/types';
import ToolbarWindow from '@main/browser/toolbar';

class SelectionToolbar {
  windowCreator: IWindow;

  unitAlive = false;
  timer: NodeJS.Timeout;

  constructor() {
    // todo 读取配置文件是否开启划词工具栏
  }

  init() {
    this.windowCreator = new ToolbarWindow();
    this.registerShortcut();
  }

  dispose() {
    iohook.removeAllListeners();
  }

  registerShortcut() {
    iohook.on('keyup', (event) => {
      if (event.altKey) {
        if (this.unitAlive) {
          // 关闭
          this.unitAlive = false;
          void this.openToolbar();
        } else {
          this.unitAlive = true;
          this.timer = setTimeout(() => {
            this.unitAlive = false;
            clearTimeout(this.timer);
          }, 260);
        }
      }
    });
  }

  async openToolbar() {
    const point = await mouse.getPosition();
    this.windowCreator.init(point);
  }
}

export default new SelectionToolbar();
