import { Request, Response } from 'express';
import { apiResponse } from '../../utils/method-helper/method';
import { catchAsync } from '../../utils/method-helper/catchAsync';
import User from '../../databases/models/user.model';
import Session from '../../databases/models/session.model';


export const showAllDashboard = catchAsync(async (req: Request, res: Response) => {

  const findAllData = await User.findAll({
    attributes: ['lastName', 'firstName', 'email'],
    include: [
      {
        model: Session,
        attributes: ['times_account_creation', 'times_logged_in', 'last_logget_out_at'],
      },
    ],
  })

  if (!findAllData) return apiResponse(
    res,
    404,
    "User Profile or User not found"
  );


  return apiResponse(res, 200, "Get all data are success!", findAllData);
});
