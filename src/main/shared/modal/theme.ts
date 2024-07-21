import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes
} from 'sequelize';
import { sequelize } from '@main/shared/db';

class ThemeModal extends Model<
  InferAttributes<ThemeModal>,
  InferCreationAttributes<ThemeModal>
> {
  declare id: number;

  /**
   * 主题类型
   */
  declare type:string;
  /**
   * 主题
   */
  declare theme: string;
  /**
   * 是否紧凑模式
   */
  declare compact: boolean;
  /**
   * 主题颜色
   */
  declare colorPrimary: string;
}

ThemeModal.init(
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
    compact: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    colorPrimary: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize: sequelize,
    tableName: 'theme',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  }
);

export default ThemeModal;
