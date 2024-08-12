
class GlobalStore {
  /**
   * 当前配置信息
   */
  private settings: ISettings;
  /**
   * 窗口默认背景颜色
   */
  private backgroundColor: string;

  setSettings(config: ISettings) {
    this.settings = config;
  }

  getSettings() {
    return this.settings;
  }

  setBackgroundColor(color: string) {
    this.backgroundColor = color;
  }

  getBackgroundColor() {
    return this.backgroundColor;
  }
}

const index = new GlobalStore();

export default index;
