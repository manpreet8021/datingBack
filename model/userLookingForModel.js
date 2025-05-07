import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import User from './UserModel.js';
import LookUpValue from './lookUpValueModel.js';

class UserLookingFor extends Model { }

UserLookingFor.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		}
	},
	{
		sequelize, // The database connection instance
		modelName: 'UserLookingFor', // The name of the model
		tableName: 'UserLookingFor', // The name of the table in MySQL
		timestamps: true, // Whether to add timestamps (createdAt, updatedAt)
	}
);
UserLookingFor.belongsTo(LookUpValue, {
	foreignKey: 'gender'
});

UserLookingFor.belongsTo(User, {
	foreignKey: 'user_id'
});


export const insertUserFor = async (data) => {
	const userLooking = await UserLookingFor.create(data);
	return userLooking
}

export default UserLookingFor