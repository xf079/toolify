import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes
} from 'sequelize';
import { sequelize } from '@main/utils/db';

class Ai extends Model<
  InferAttributes<Ai>,
  InferCreationAttributes<Ai>
> {
  declare id: number;
  declare name: string;
  declare logo: string;
  declare sort: number;
}

Ai.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sort: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
      allowNull: true
    }
  },
  {
    sequelize: sequelize,
    tableName: 'ai',
    createdAt: false,
    updatedAt: false
  }
);

export default Ai;
