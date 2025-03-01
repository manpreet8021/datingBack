import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';

class OtpLog extends Model {}

OtpLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    number: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    response: {
      type: DataTypes.STRING(34),
      allowNull: false
    }
  },
  {
    sequelize, // The database connection instance
    modelName: 'OtpLog', // The name of the model
    tableName: 'OtpLog', // The name of the table in MySQL
    timestamps: true, // Whether to add timestamps (createdAt, updatedAt)
  }
);

export default OtpLog
export const getOtpByPhoneNumber = async(condition) => await OtpLog.findOne({ where: condition })
export const insertOtp = async (data) => await OtpLog.create(data)
export const updateOtpActive = async (data, condition) => await OtpLog.update(data, {where: condition})