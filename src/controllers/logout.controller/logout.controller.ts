import { Request, Response } from 'express';
import { apiResponse } from '../../utils/method-helper/method';
import { catchAsync } from '../../utils/method-helper/catchAsync';
import Session from '../../databases/models/session.model';
import { now } from '../../utils/unix-epoch-date/date';


export const logout = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user;

  // find Session in Db for requested signout
  const findSession = await Session.findOne({
    where: {
      user_id: userId,
    },
  });

  if (!findSession) {
    return apiResponse(
      res,
      404,
      "Session or User not found to logout"
    );
  }
  // destroy session on db
  findSession.jwt_token = ""
  findSession.is_active = false
  findSession.last_logget_out_at = now()
  await findSession.save()

  // Clear the JWT cookie
  res.clearCookie("jwt");

  return apiResponse(res, 200, "Logout Successful!");
});
