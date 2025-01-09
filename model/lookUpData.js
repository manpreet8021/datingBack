import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';

class LookUpData extends Model {}

LookUpData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize, // The database connection instance
    modelName: 'LookUpData', // The name of the model
    tableName: 'lookUpData', // The name of the table in MySQL
    timestamps: true, // Whether to add timestamps (createdAt, updatedAt)
  }
);

export default LookUpData