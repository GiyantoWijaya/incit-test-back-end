import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { EnvironmentConfig } from '../interfaces/configInterfaces/config.interface';

dotenv.config({ path: path.join(__dirname, "../.env") });

const config: EnvironmentConfig = {
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

export default config;