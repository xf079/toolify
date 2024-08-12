import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes
} from 'sequelize';
import { sequelize } from '@main/utils/db';

class FeaturesModal extends Model<
  InferAttributes<FeaturesModal>,
  InferCreationAttributes<FeaturesModal>
> {
  declare id: number;

  /**
   * 唯一标识
   */
  declare unique: string;
  /**
   * 插件类型
   */
  declare type: string;
  /**
   * 插件名称
   */
  declare name: string;
  /**
   * 入口
   */
  declare main: string;
  /**
   * 插件logo
   */
  declare logo: string;
  /**
   * 插件描述
   */
  declare description: string;
  /**
   * 是否自动分离为独立窗口
   */
  declare separation: boolean;
  /**
   * 是否允许多开
   */
  declare single: boolean;

  /**
   * 关闭后是否自动卸载
   */
  declare autoUninstalled: boolean;

  /**
   * 插件版本
   */
  declare version: string;

  /**
   * 插件平台
   */
  declare platform: string;
}

FeaturesModal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    unique: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    main: {
      type: DataTypes.STRING,
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    separation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    single: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    autoUninstalled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize: sequelize,
    tableName: 'feature',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  }
);

export default FeaturesModal;
