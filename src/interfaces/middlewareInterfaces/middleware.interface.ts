import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface SessionDataInterface extends JwtPayload {
  id?: string;
  whoReq?: string;
}
export interface RequestUser extends Request {
  user?: string;
}


