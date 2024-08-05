class GlobalStore {
  /**
   * 当前配置信息
   */
  private config: IConfig;
  /**
   * 窗口默认背景颜色
   */
  private backgroundColor: string;

  setConfig(config: IConfig) {
    this.config = config;
  }

  getConfig() {
    return this.config;
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
