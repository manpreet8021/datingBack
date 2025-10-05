import { DataTypes, Model, Op, Sequelize, literal } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import Event from './eventBean.js';
import LookUpValue from './lookUpValueModel.js';

class EventDate extends Model { }

EventDate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  {
    sequelize, // The database connection instance
    modelName: 'EventDate', // The name of the model
    tableName: 'EventDate', // The name of the table in MySQL
    timestamps: true, // Whether to add timestamps (createdAt, updatedAt)
  }
);
export default EventDate