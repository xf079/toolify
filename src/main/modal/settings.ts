import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes
} from 'sequelize';
import { sequelize } from '@main/utils/db';

class Settings extends Model<
  InferAttributes<Settings>,
  InferCreationAttributes<Settings>
> {
  declare id: number;
  /**
   * 配置类型
   */
  declare type: string;
  /**
   * 主题
   */
  declare theme: string;

  /**
   * 主题颜色
   */
  declare colorPrimary: string;

  /**
   * 是否开机启动
   */
  declare start: boolean;
  /**
   * 占位符
   */
  declare placeholder: string;
}

Settings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    theme: {
      type: DataTypes.STRING,
      allowNull: false
    },
    colorPrimary: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    placeholder: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize: sequelize,
    tableName: 'settings',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  }
);

export default Settings;
