import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import User from './UserModel.js';

class UserLocation extends Model { }

UserLocation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },
  {
    sequelize, // The database connection instance
    modelName: 'UserLocation', // The name of the model
    tableName: 'UserLocation', // The name of the table in MySQL
    timestamps: true, // Whether to add timestamps (createdAt, updatedAt)
  }
);
UserLocation.belongsTo(User, {
  foreignKey: 'user_id'
});


export const insertLocation = async (data) => {
  const userLocation = await UserLocation.create(data);
  return userLocation
}

export default UserLocation