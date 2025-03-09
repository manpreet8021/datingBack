import { sequelize } from "./sequelize.js";
import LookUpData from "../model/lookUpDataModel.js";
import LookUpValue from "../model/lookUpValueModel.js";
import OtpLog from "../model/otpLogModel.js";
import User from "../model/userModel.js";

const connectDb = async () => {
  await sequelize
    .authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((error) =>
      console.error("Unable to connect to the database:", error)
    );

  await sequelize
    .sync({ force: true }) // This will drop the table and recreate it, be careful in production!
    .then(() => console.log("Database & tables created!"))
    .catch((error) => console.error("Error syncing database:", error));
};

const seed = () => {
  const lookUpData = new LookUpData(
    {
      id: 1,
      name: "Gender",
      active: 1,
    },
    {
      id: 2,
      name: "Interest",
      active: 1,
    }
  );

  const lookUpValue = new LookUpValue(
    {
      id: 1,
      lookUpDataId: 1,
      name: "Male",
      icon: 'male',
      active: 1,
    },
    {
      id: 2,
      lookUpDataId: 1,
      name: "Female",
      icon: 'female',
      active: 1,
    },
    {
      id: 3,
      lookUpDataId: 1,
      name: "Other",
      icon: 'transgender-outline',
      active: 1
    },
    {
      id: 4,
      lookUpDataId: 2,
      name: "",
    }
  );
};

export { connectDb };
