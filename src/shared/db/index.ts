import 'fake-indexeddb/auto';
import { Dexie, Table } from 'dexie';
import { IConfig } from '@shared/db/types';

class DBInstance extends Dexie {
  configs!: Table<IConfig>;
  constructor() {
    super('Apeak');
    this.version(1).stores({
      configs: '++id,type,value'
    });
  }
}

export default new DBInstance();
