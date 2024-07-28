import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes
} from 'sequelize';
import { sequelize } from '@main/shared/db';

class DeveloperModal extends Model<
  InferAttributes<DeveloperModal>,
  InferCreationAttributes<DeveloperModal>
> {
  declare id: number;

  /**
   * 唯一标识
   */
  declare unique: string;

  /**
   * 插件名称
   */
  declare name: string;

  /**
   * 入口
   */
  declare main: string;

  /**
   * logo
   */
  declare logo: string;

  /**
   * 主页
   */
  declare homepage: string;

  /**
   * 插件描述
   */
  declare description: string;

  /**
   * 插件目录位置
   */
  declare source: string;

  /**
   * 是否运行
   */
  declare running: boolean;
}

DeveloperModal.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    main: {
      type: DataTypes.STRING,
      allowNull: true
    },
    homepage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    running: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    }
  },
  {
    sequelize: sequelize,
    tableName: 'developer',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  }
);

export default DeveloperModal;
