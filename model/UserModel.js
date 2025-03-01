import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';

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
    authtype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: true
    }
  },
  {
    sequelize, // The database connection instance
    modelName: 'User', // The name of the model
    tableName: 'user', // The name of the table in MySQL
    timestamps: true, // Whether to add timestamps (createdAt, updatedAt)
  }
);

export const checkOrCreateUser = async (data) => {
  const [user] = await User.findOrCreate({ where: data.condition, defaults: data.defaults });
  return user;
};

export default User