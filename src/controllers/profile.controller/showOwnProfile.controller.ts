import { Request, Response } from 'express';
import { apiResponse } from '../../utils/method-helper/method';
import { catchAsync } from '../../utils/method-helper/catchAsync';
import User from '../../databases/models/user.model';


export const showProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user;

  const findUserProfile = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (!findUserProfile) return apiResponse(
    res,
    404,
    "User Profile or User not found"
  );


  return apiResponse(res, 200, "Get Profile Success!", findUserProfile);
});
