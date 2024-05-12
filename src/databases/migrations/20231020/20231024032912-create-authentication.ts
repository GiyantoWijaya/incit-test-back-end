"use strict";
import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('Authentications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataType.UUID,
      },
      user_id: {
        type: DataType.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      password: {
        type: DataType.STRING,
      },
      google_authentication_id: {
        type: DataType.STRING,
      },
      facebook_authentication_id: {
        type: DataType.STRING,
      },
      token_verify_email: {
        type: DataType.INTEGER,
      },
      token_expired_email: {
        type: DataType.INTEGER,
      },
      is_verified: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addConstraint('Authentications', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_authentication_user_id',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Authentications');
  },
};
