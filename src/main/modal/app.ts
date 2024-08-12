import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes
} from 'sequelize';
import { sequelize } from '@main/utils/db';

class AppModal extends Model<
  InferAttributes<AppModal>,
  InferCreationAttributes<AppModal>
> {
  declare id: number;
  declare name: string;
  declare address: string;
  declare logo: string;
}

AppModal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize: sequelize,
    tableName: 'app',
    createdAt: false,
    updatedAt: false
  }
);

export default AppModal;
