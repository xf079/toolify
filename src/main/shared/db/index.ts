import { Sequelize } from 'sequelize';
import { getDataPath } from '@main/utils/os';


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: getDataPath('/data/database.sqlite'),
  // 选择一种日志记录参数
  logging: false
});


export async function sequelizeSync(){
  await sequelize.sync();
}


export default sequelize
