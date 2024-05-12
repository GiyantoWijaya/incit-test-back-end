import { Request, Response } from 'express';
import { apiResponse } from '../../utils/method-helper/method';
import { catchAsync } from '../../utils/method-helper/catchAsync';
import User from '../../databases/models/user.model';


export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user;
  const { firstName, lastName } = req.body


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

  // destroy session on db
  findUserProfile.firstName = firstName
  findUserProfile.lastName = lastName
  await findUserProfile.save()

  return apiResponse(res, 200, "Change Profile Successfully!");
});
