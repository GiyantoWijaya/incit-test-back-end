import { NextFunction, Request, Response } from 'express';
import { RequestUser, SessionDataInterface } from '../../interfaces/middlewareInterfaces/middleware.interface';
import * as jwt from 'jsonwebtoken';
import Session from '../../databases/models/session.model';
import { apiResponse } from '../../utils/method-helper/method';

const SECRET_KEY = process.env.JWT_SECRET;

export const verifyAuth = (req: Request | RequestUser, res: Response, next: NextFunction) => {
  try {
    const requestToken = req.headers["authorization"];
    const token: string | undefined = requestToken && requestToken.split(" ")[1];
    console.log(token)

    jwt.verify(token as string, SECRET_KEY as string, async (err: any, decoded) => {
      const sessionData = decoded as SessionDataInterface;
      if (err) {
        return apiResponse(
          res,
          401,
          "Unauthorized Token",
          "Invalid Token, Please Provide A Correct Token"
        );
      } else {
        // check session in DB
        const findUser = await Session.findOne({
          where: { user_id: sessionData.id, jwt_token: token },
        });
        if (!findUser) {
          return apiResponse(res, 401, "Unauthorized User, Please login");
        }
        req.user = sessionData.id;
        next();
      }
    });
  } catch (error) {
    console.error((error as Error).message);
  }
};
