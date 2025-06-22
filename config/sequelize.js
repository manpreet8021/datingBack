import { Sequelize } from 'sequelize';


const sequelize = new Sequelize({
  host: 'localhost',         // Database host
  dialect: 'mysql',          // Database type (e.g., mysql, postgres, etc.)
  username: process.env.MYSQLUSER, // Database username loveiosa
  password: process.env.MYSQLPASSWORD, // Database password 0bBwcbfb51
  database: process.env.MYSQLDATABASE, // Database name Loveiosa
  logging: console.log,      // Optional, logs SQL queries to console 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
});

export { sequelize };
