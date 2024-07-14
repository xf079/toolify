import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes
} from 'sequelize';
import sequelize from '@main/shared/db';

class SettingsModal extends Model<
  InferAttributes<SettingsModal>,
  InferCreationAttributes<SettingsModal>
> {
  declare id: number; // 您可以使用 `declare` 关键字添加键入信息, 而无需添加实际的公共类字段.
  /**
   * 配置类型
   */
  declare type: string;
  /**
   * 是否开机启动
   */
  declare start: boolean;
  /**
   * 是否启动引导
   */
  declare guide: boolean;
  /**
   * 当前语言
   */
  declare language: string;
  /**
   * 占位符
   */
  declare placeholder: string;
}

SettingsModal.init(
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
    start: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    guide: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false
    },
    placeholder: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'settings',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  }
);

export default SettingsModal;
