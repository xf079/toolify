import db from '@shared/db';

class ConfigModal {
  async getConfig(type: string) {
    return db.configs.where({ type }).first();
  }
  setConfig(type: string, value: string){
    return db.configs.put({ type, value });
  }
}

const configModal = new ConfigModal;

export default configModal;
