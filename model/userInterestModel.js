import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import User from './userModel.js';
import LookUpValue from './lookUpValueModel.js';

class UserInterest extends Model {}

UserInterest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize, // The database connection instance
    modelName: 'UserInterest', // The name of the model
    tableName: 'UserInterest', // The name of the table in MySQL
    timestamps: true, // Whether to add timestamps (createdAt, updatedAt)
  }
);

User.hasMany(UserInterest, {
  foreignKey: 'user_id'
});
UserInterest.belongsTo(User, {
  foreignKey: 'user_id'
});
LookUpValue.hasMany(UserInterest, {
  foreignKey: 'interest_id'
});
UserInterest.belongsTo(LookUpValue, {
  foreignKey: 'interest_id'
});

export default UserInterest

export const insertInterest = async(value, transaction) => { await UserInterest.bulkCreate(value, { transaction })}