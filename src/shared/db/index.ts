import { Dexie, Table } from 'dexie';

export interface Config {
  id?: number;
  key: string;
  value: string;
}

class DBInstance extends Dexie {
  configs!: Table<Config>;
  constructor() {
    super('Apeak');
    this.version(1).stores({
      configs: '++id,key,value'
    });
  }
}


export default new DBInstance();
