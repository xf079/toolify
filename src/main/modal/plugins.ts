import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes
} from 'sequelize';
import { sequelize } from '@main/utils/db';

export class Plugins extends Model<
  InferAttributes<Plugins>,
  InferCreationAttributes<Plugins>
> {
  declare id: number;
  /**
   * 插件类型
   * system - 内置
   * plugin-dev - 开发插件
   * plugin-prod - 生产插件
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
  declare uninstalled: boolean;

  /**
   * 插件版本
   */
  declare version: string;

  /**
   * 插件平台
   */
  declare platform: string;
}

Plugins.init(
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
      unique: true,
      allowNull: false
    },
    main: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
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
    uninstalled: {
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
    tableName: 'plugins',
    createdAt: false,
    updatedAt: false
  }
);

export class Features extends Model<
  InferAttributes<Features>,
  InferCreationAttributes<Features>
> {
  declare id: number;
  /**
   * 插件应用提供的某个功能的唯一标示，
   * 此为必选项，且插件应用内不可重复
   */
  declare code: string;

  /**
   * 对此功能的说明，将在搜索列表对应位置中显示
   */
  declare explain: string;

  /**
   * 功能图标, 相对路径。支持 png、jpg、svg 格式
   */
  declare icon?: string;

  /**
   * 功能适配平台 ["win32", "darwin", "linux"]，此为可选项
   */
  declare platform: string;
}

Features.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    explain: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icon: {
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
    tableName: 'features',
    createdAt: false,
    updatedAt: false
  }
);

export class Cmd extends Model<
  InferAttributes<Cmd>,
  InferCreationAttributes<Cmd>
> {
  declare id: number;
  declare type: string;
  declare label: string;
  declare text: string;
  declare fileType: string;
  declare match: string;
  declare exclude: string;
  declare min: number;
  declare max: number;
}

Cmd.init(
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
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    match: {
      type: DataTypes.STRING,
      allowNull: true
    },
    exclude: {
      type: DataTypes.STRING,
      allowNull: true
    },
    min: {
      type: DataTypes.NUMBER,
      defaultValue: 2,
      allowNull: true
    },
    max: {
      type: DataTypes.NUMBER,
      defaultValue: 10000,
      allowNull: true
    }
  },
  {
    sequelize: sequelize,
    tableName: 'cmd',
    createdAt: false,
    updatedAt: false
  }
);

Plugins.hasMany(Features, { foreignKey: 'id', as: 'features' });
Features.belongsTo(Plugins, { foreignKey: 'pluginId' });
Features.hasMany(Cmd, { foreignKey: 'id',as: 'cmds' });
Cmd.belongsTo(Features, { foreignKey: 'featureId' });

export default Plugins;
