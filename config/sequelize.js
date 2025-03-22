import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  host: 'localhost',         // Database host
  dialect: 'mysql',          // Database type (e.g., mysql, postgres, etc.)
  username: 'root', // Database username
  password: '', // Database password
  database: 'Dating', // Database name
  logging: console.log,      // Optional, logs SQL queries to console
});

export { sequelize };
