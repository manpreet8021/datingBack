import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import User from './UserModel.js';

class UserPreference extends Model { }

UserPreference.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    distanceInKm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dobStart: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dobEnd: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    recentlyActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize, // The database connection instance
    modelName: 'UserPreference', // The name of the model
    tableName: 'UserPreference', // The name of the table in MySQL
    timestamps: true, // Whether to add timestamps (createdAt, updatedAt)
  }
);

UserPreference.belongsTo(User, {
  foreignKey: 'userId'
});

export default UserPreference

export const getUserPreferenceById = async (id) => await UserPreference.findByPk(id)
export const getUserPreferenceByCondition = async (condition) => await UserPreference.findOne({ where: condition })
export const addUserPreference = async (data, transaction) => await UserPreference.create(data, { transaction })
export const updateUserPreference = async (data, id, transaction) => await UserPreference.update(data, { where: { id: id }, transaction })