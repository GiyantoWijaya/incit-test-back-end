import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import config from "../../config/config";
import User from "./user.model";
import Session from "./session.model";
import Authentication from "./authentication";


export default class Database {
  public sequelize: Sequelize | undefined;

  constructor() {
    this.connectToDatabase();
  }

  private async connectToDatabase() {
    const environment = process.env.NODE_ENV || 'development';
    const dbConfig = config[environment] as SequelizeOptions;
    const sequelize = new Sequelize({
      database: dbConfig.database,
      username: dbConfig.username,
      password: dbConfig.password,
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      port: dbConfig.port,
      // pool: {
      //   max: 5,
      //   min: 0,
      //   acquire: 30000,
      //   idle: 10000
      // },
      models: [User, Authentication, Session],
    });


    try {
      await sequelize.authenticate();
      // Sync models with database
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", (error as Error).message);
    }
  }
}
