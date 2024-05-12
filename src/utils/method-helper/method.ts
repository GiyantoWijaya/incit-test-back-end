import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../databases/models/user.model';
import { Response } from 'express';
import { ValidationError } from 'express-validator';

const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);

// Find User In DB
export async function findUser(email: string) {
  const user = await User.findOne({ where: { email } });
  return user;
}

// MCR Response
export function apiResponse(res: Response, status: number = 200, message: string | string[] | ValidationError[] = "", data: {} = {}) {
  res.status(status).json({
    message,
    data,
  });
}

// bcrypt password
export async function encryptPassword(password: string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

// generate jwt token
export function createToken(id: string) {
  return jwt.sign({ id }, process.env.JWT_SECRET || '', {
    expiresIn: parseInt(process.env.MAX_AGE || '3600', 10),
  });
}

export function generateEmailToken(): number {
  return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

