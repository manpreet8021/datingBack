import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import User from './UserModel.js';

class Match extends Model { }

Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    initiator: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    responder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requested_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    responded_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'matched', 'unmatched'),
      defaultValue: 'pending',
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
    modelName: 'Match',
    tableName: 'Match',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['initiator', 'responder'],
      },
    ]
  }
);

Match.belongsTo(User, {
  foreignKey: 'initiator'
});

Match.belongsTo(User, {
  foreignKey: 'responder'
});

export default Match

export const checkIfMatchExist = async (initiator, responder) => {
  return await Match.findOne({
    where: {
      [Op.or]: [
        { initiator: initiator, responder: responder },
        { initiator: responder, responder: initiator }
      ],
    },
  });
}
export const insertMatch = async(data) => {
  const match = await Match.create(data)
  return match
}