const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_SCHEMA_AUTH,
    host: process.env.MYSQL_HOST,
    dialect: process.env.MYSQL_DIALECT,
    port: process.env.MYSQL_PORT,
  },
  test: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_SCHEMA_AUTH,
    host: process.env.MYSQL_HOST,
    dialect: process.env.MYSQL_DIALECT,
    port: process.env.MYSQL_PORT,
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_SCHEMA_AUTH,
    host: process.env.MYSQL_HOST,
    dialect: process.env.MYSQL_DIALECT,
    port: process.env.MYSQL_PORT,
  },
};
