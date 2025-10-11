import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import Event from './eventBean.js';
import Match from './userMatchModel.js';

class EventMatch extends Model { }

EventMatch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    match_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'EventMatch',
    tableName: 'EventMatch',
    timestamps: true
  }
);

EventMatch.belongsTo(Event, {
  foreignKey: 'event_id'
});

EventMatch.belongsTo(Match, {
  foreignKey: 'match_id'
});

export default EventMatch

export const checkIfEventMatchExist = async (condition) => {return await EventMatch.findOne({where: condition})}
export const insertEventMatch = async(data) => await EventMatch.create(data);