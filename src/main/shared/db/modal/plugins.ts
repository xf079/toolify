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
   * 插件类型
   */
  declare type: string;
  /**
   * 插件名称
   */
  declare name: string;
  declare pinYinName: string;
  /**
   * 插件描述
   */
  declare desc: string;
  /**
   * 插件版本
   */
  declare version: string;

  /**
   * 插件logo
   */
  declare logo: string;

  /**
   * 插件平台
   */
  declare platform: string;

  /**
   * 插件是否可以多开
   */
  declare single: boolean;

  /**
   * 插件默认高度
   */
  declare height: number;

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
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pinYinName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false
    },
    single: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    height: {
      type: DataTypes.INTEGER,
      defaultValue: 600,
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
