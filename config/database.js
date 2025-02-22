import { sequelize } from "./sequelize.js";
import LookUpData from "../model/lookUpDataModel.js";
import LookUpValue from "../model/lookUpValueModel.js";


const connectDb = async() => {
  await sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch((error) => console.error('Unable to connect to the database:', error));
  
  await sequelize.sync({ alter: true })  // This will drop the table and recreate it, be careful in production!
    .then(() => console.log('Database & tables created!'))
    .catch((error) => console.error('Error syncing database:', error));
}

export { connectDb }