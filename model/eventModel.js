import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import User from './userModel.js';
import LookUpValue from './lookUpValueModel.js';

class Event extends Model {}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    public_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize, // The database connection instance
    modelName: 'Event', // The name of the model
    tableName: 'Event', // The name of the table in MySQL
    timestamps: true, // Whether to add timestamps (createdAt, updatedAt)
  }
);

User.hasMany(Event, { foreignKey: 'userId', as: 'events' });
Event.belongsTo(User, { foreignKey: 'userId', as: 'user' });

LookUpValue.hasMany(Event, { foreignKey: 'category', as: 'events' });
Event.belongsTo(LookUpValue, { foreignKey: 'category', as: 'categoryInfo' });

export default Event

export const getEvent = async () => await Event.findAll()
export const getEventById = async (id) => await Event.findByPk(id)
export const getEventByCondition = async(condition) => await Event.findOne({ where: condition })
export const addEvent = async (data, transaction) => await Event.create(data, {transaction})
export const updateEvent = async (data, id, transaction) => await Event.update(data, {where: {id: id}, transaction})