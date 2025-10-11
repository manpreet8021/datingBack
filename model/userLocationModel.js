import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import User from './UserModel.js';
import ngeohash from 'ngeohash';

const GEO_PRECISION = 6;

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
    },
    geohash: {
      type: DataTypes.STRING(12),
      allowNull: true,
      index: true,
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

UserLocation.beforeCreate((loc) => {
  loc.geohash = ngeohash.encode(loc.latitude, loc.longitude, GEO_PRECISION);
});

UserLocation.beforeUpdate((loc) => {
  if (loc.changed('latitude') || loc.changed('longitude')) {
    loc.geohash = ngeohash.encode(loc.latitude, loc.longitude, GEO_PRECISION);
  }
});

export const insertLocation = async (data) => {
  const userLocation = await UserLocation.create(data);
  return userLocation
}
export const getLatestLocation = async (id) => {
  return await UserLocation.findOne({
    where: { user_id: id },
    order: [['createdAt', 'DESC']],
  })
}

export default UserLocation