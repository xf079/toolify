import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes
} from 'sequelize';
import sequelize from '@main/shared/db';

class PluginsModal extends Model<
  InferAttributes<PluginsModal>,
  InferCreationAttributes<PluginsModal>
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
  declare desc: string;
  /**
   * 插件版本
   */
  declare version: string;

  /**
   * 是否运行中
   */
  declare running: boolean;

  /**
   * 插件平台
   */
  declare platform: string;

  /**
   * 更多信息
   */
  declare features: string;
}

PluginsModal.init(
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
    desc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    running: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: true
    },
    features: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'plugins',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  }
);

export default PluginsModal;
