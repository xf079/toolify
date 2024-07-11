import 'fake-indexeddb/auto';
import { Dexie, Table } from 'dexie';
import { IConfig } from '@main/shared/db/types';
import { defaultConfig } from '@common/config/default-config';

class DBInstance extends Dexie {
  configs!: Table<IConfig>;
  constructor() {
    super('Apeak');
    this.version(1).stores({
      configs: '++id,type,value',
      users: '++id,name,email,password',
      plugins:
        '++id,name,description,version,author,homepage,license,repository,keywords,dependencies,devDependencies,scripts,main,module,types,unpkg,jsdelivr,browser,files,bin,engines,os,cpu,preferGlobal,private,publishConfig,licenseFile,licenseText,licenseUrl,licenseName,licenseSpdxId,licenseSpdxFullName,licenseSpdxUrl,licenseSpdxLicenseText,licenseSpdxLicenseTextUrl'
    });
  }
}

const db = new DBInstance();

db.on('populate', () => {
  for (const key in defaultConfig) {
    db.configs.add({ type: key, value: defaultConfig[key] });
  }
});

export default db;
