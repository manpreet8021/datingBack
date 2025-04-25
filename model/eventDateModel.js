import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import User from './userModel.js';
import Event from './eventModel.js';

class EventDate extends Model {}

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

Event.hasMany(EventDate, { foreignKey: 'eventId', as: 'event' });
EventDate.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

export default EventDate

export const addEventDate = async(data, transaction) => await EventDate.create(data, {transaction})