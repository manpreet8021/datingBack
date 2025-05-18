import { DataTypes, Model, Op, literal } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import User from './UserModel.js';
import Event from './eventModel.js';
import LookUpValue from './lookUpValueModel.js';
import UserImage from "../model/userImagesModel.js";

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

Event.hasMany(EventDate, { foreignKey: 'eventId', as: 'event' });
EventDate.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

export default EventDate

export const addEventDate = async (data, transaction) => await EventDate.create(data, { transaction })
export const getEvent = async (includeUserEvents, latitude, longitude, userId, limit, offset) => {
  const rows = await sequelize.query(
    `
      SELECT 
        e.id as id,
        lv.name as interest,
        e.title as postText,
        ui.image_url as profileImage,
        u.name as username,
        e.description as description,
        (6371 * acos(
          cos(radians(:latitude)) * cos(radians(CAST(e.latitude AS DECIMAL(10,6)))) * 
          cos(radians(CAST(e.longitude AS DECIMAL(10,6))) - radians(:longitude)) + 
          sin(radians(:latitude)) * sin(radians(CAST(e.latitude AS DECIMAL(10,6))))
        )) AS distance,
        e.image_url as image_url
      FROM Event e
      INNER JOIN EventDate ed ON ed.eventId = e.id
      INNER JOIN lookUpValue lv ON lv.id = e.category
      INNER JOIN user u ON u.id = e.userId
      INNER JOIN UserImage ui ON ui.user_id = u.id
      WHERE 
        e.active = true
        AND ed.active = true
        AND ed.date >= CURDATE()
        AND ui.image_type='main'
        AND u.id = :userId
      HAVING distance<=5
      ORDER BY ed.date ASC
      `,
    {
      replacements: { latitude, longitude, limit, offset, userId },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  console.log(rows)
  return rows;
}