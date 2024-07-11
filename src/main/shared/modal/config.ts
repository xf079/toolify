import db from '@main/shared/db';

class ConfigModal {
  async get(type: string) {
    return db.configs.where({ type }).first();
  }
  set(type: string, value: string){
    return db.configs.add({ type, value });
  }

  update(type: string, value: string) {
    return db.configs.where({ type }).modify({ value });
  }

  delete(type: string) {
    return db.configs.where({ type }).delete();
  }

  clear() {
    return db.configs.clear();
  }

  getAll() {
    return db.configs.toArray();
  }
}

const configModal = new ConfigModal;

export default configModal;
