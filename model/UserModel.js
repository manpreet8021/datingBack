import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import LookUpValue from './lookUpValueModel.js';

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true
    },
    authtype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  },
  {
    sequelize, // The database connection instance
    modelName: 'User', // The name of the model
    tableName: 'user', // The name of the table in MySQL
    timestamps: true, // Whether to add timestamps (createdAt, updatedAt)
  }
);
User.belongsTo(LookUpValue, {
  foreignKey: 'gender'
});

export const checkOrCreateUser = async (data) => {
  const [user] = await User.findOrCreate({ where: data.condition, defaults: data.defaults });
  return user;
};
export const updateUser = async (data, id, transaction) => {
  const [user] = await User.update(data, { where: {id}, transaction });
  return user
}
export const getUser = async (id) => { 
  const user = await User.findOne({ where: { id } });
  return user
}
export default User