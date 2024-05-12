"use strict";
import { Table, Model, ForeignKey, Column, BelongsTo, DataType } from 'sequelize-typescript';
import User from './user.model';
import { now } from '../../utils/unix-epoch-date/date';
import { Optional } from 'sequelize';


interface AuthenticationAttributes {
  id: string;
  user_id: string;
  password?: string;
  google_authentication_id?: string;
  facebook_authentication_id?: string;
  token_verify_email?: number;
  token_expired_email?: number;
  is_verified?: boolean;
  createdAt?: number;
  updatedAt?: number;

}
interface AuthenticationInput extends Optional<AuthenticationAttributes, 'id' | 'user_id'> { }


@Table({
  tableName: 'Authentications', timestamps: false,
})
export default class Authentication extends Model<AuthenticationAttributes, AuthenticationInput> {
  @Column({
    type: DataType.STRING(36),
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id?: string;

  @Column(DataType.STRING)
  password?: string;

  @Column(DataType.STRING)
  google_authentication_id?: string;

  @Column(DataType.STRING)
  facebook_authentication_id?: string;

  @Column(DataType.INTEGER)
  token_verify_email?: number;

  @Column(DataType.INTEGER)
  token_expired_email?: number;

  @Column(DataType.BOOLEAN)
  is_verified?: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: now(),
  })
  createdAt?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: now(),
  })
  updatedAt?: number;

  // Relations
  @BelongsTo(() => User, 'user_id')
  user?: User;
}

