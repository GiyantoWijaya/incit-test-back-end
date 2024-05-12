"use strict";
import { QueryInterface } from 'sequelize';
import { DataType, Sequelize } from 'sequelize-typescript';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("Users", {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataType.STRING,
      },
      firstName: {
        type: DataType.STRING,
      },
      lastName: {
        type: DataType.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataType.INTEGER,
      },
      updatedAt: {
        allowNull: false,
        type: DataType.INTEGER,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("Users");
  },
};
