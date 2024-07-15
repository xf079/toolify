import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes
} from 'sequelize';
import sequelize from '@main/shared/db';

class ApplicationModal extends Model<
  InferAttributes<ApplicationModal>,
  InferCreationAttributes<ApplicationModal>
> {
  declare id: number; // 您可以使用 `declare` 关键字添加键入信息, 而无需添加实际的公共类字段.
  declare type: string;
  declare name: string;
  declare icon: string;
  declare target: string;
}

ApplicationModal.init(
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
    icon: {
      type: DataTypes.STRING,
      allowNull: false
    },
    target: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'application',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  }
);

export default ApplicationModal;
