"use strict";
import { QueryInterface } from 'sequelize';
import { DataType, Sequelize } from 'sequelize-typescript';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("Sessions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataType.UUID,
      },
      user_id: {
        type: DataType.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      jwt_token: {
        type: DataType.STRING,
      },
      token_expiration: {
        type: DataType.INTEGER,
      },
      last_logged_in_at: {
        type: DataType.INTEGER,
      },
      times_logged_in: {
        type: DataType.INTEGER,
      },
      is_active: {
        type: DataType.BOOLEAN,
      },
      times_account_creation: {
        type: DataType.INTEGER,
      },
      last_logget_out_at: {
        type: DataType.INTEGER,
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

    await queryInterface.addConstraint("Sessions", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_sessions_user_id",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("Sessions");
  },
};
