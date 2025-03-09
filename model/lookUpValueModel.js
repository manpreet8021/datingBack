import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import LookUpData from './lookUpDataModel.js';

class LookUpValue extends Model {}

LookUpValue.init(
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
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize, // The database connection instance
    modelName: 'LookUpValue', // The name of the model
    tableName: 'lookUpValue', // The name of the table in MySQL
    timestamps: true, // Whether to add timestamps (createdAt, updatedAt)
  }
);

LookUpData.hasMany(LookUpValue, {
  foreignKey: 'parent'
});
LookUpValue.belongsTo(LookUpData, {
  foreignKey: 'parent'
});

export default LookUpValue