import { Sequelize } from 'sequelize';
import { getDataPath } from '@main/utils/fs';
import { PUBLIC_PATH } from '@main/config/constants';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: getDataPath(PUBLIC_PATH + '/data/database.sqlite'),
  // 选择一种日志记录参数
  logging: true
});

export default async function sequelizeSync() {
  await sequelize.sync({ force: true });
}
