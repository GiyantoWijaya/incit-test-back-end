import { Table, Model, Column, DataType, HasMany, HasOne } from 'sequelize-typescript';
import { now } from '../../utils/unix-epoch-date/date';
import Session from './session.model';
import User_status from './authentication';
import { Optional } from 'sequelize';

interface UserAttributes {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt?: number;
  updatedAt?: number;

}
interface UserInput extends Optional<UserAttributes, 'id'> { }


@Table({
  tableName: 'Users',
})
export default class User extends Model<UserAttributes, UserInput> {
  @Column({
    type: DataType.STRING(36),
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id!: string;

  @Column(DataType.STRING)
  email?: string;

  @Column(DataType.STRING)
  firstName?: string;

  @Column(DataType.STRING)
  lastName?: string;

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


  @HasOne(() => User_status, 'user_id')
  user_status!: User_status;

  @HasMany(() => Session, 'user_id')
  sessions!: Session[];
}
