import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import User from './userModel.js';
import LookUpValue from './lookUpValueModel.js';

class UserImage extends Model {}

UserImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    public_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize, // The database connection instance
    modelName: 'UserImage', // The name of the model
    tableName: 'UserImage', // The name of the table in MySQL
    timestamps: true, // Whether to add timestamps (createdAt, updatedAt)
  }
);

User.hasMany(UserImage, {
  foreignKey: 'user_id'
});
UserImage.belongsTo(User, {
  foreignKey: 'user_id'
});

export default UserImage