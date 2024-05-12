import { Model, Table, BelongsTo, ForeignKey, Column, DataType, PrimaryKey } from 'sequelize-typescript';
import { now } from '../../utils/unix-epoch-date/date';
import User from './user.model';
import { Optional } from 'sequelize';

interface SessionAttributes {
  id: string;
  user_id: string;
  jwt_token?: string | null;
  token_expiration?: number;
  last_logged_in_at?: number;
  times_logged_in?: number;
  is_active?: boolean;
  times_account_creation?: number;
  last_logget_out_at?: number;
  createdAt?: number;
  updatedAt?: number;

}
interface SessionInput extends Optional<SessionAttributes, 'id' | 'user_id'> { }


@Table({
  tableName: 'Sessions',
})
export default class Session extends Model<SessionAttributes, SessionInput> {
  @Column({
    type: DataType.STRING(36),
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id!: string;

  @Column(DataType.STRING)
  jwt_token!: string;

  @Column(DataType.INTEGER)
  token_expiration!: number;

  @Column(DataType.INTEGER)
  last_logged_in_at!: number;

  @Column(DataType.INTEGER)
  times_logged_in!: number;

  @Column(DataType.BOOLEAN)
  is_active!: boolean;

  @Column(DataType.INTEGER)
  times_account_creation!: number;

  @Column(DataType.INTEGER)
  last_logget_out_at!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: now(),
  })
  createdAt!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: now(),
  })
  updatedAt!: number;


  @BelongsTo(() => User)
  user!: User;

}


