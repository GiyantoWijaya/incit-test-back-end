import bcrypt from 'bcrypt';
import { apiResponse, encryptPassword } from '../../utils/method-helper/method';
import { check, ValidationError, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/method-helper/catchAsync';
import Authentication from '../../databases/models/authentication';


export const validatorChangePassword = [
  check("old_password")
    .notEmpty()
    .withMessage("old_password is required")
    .custom(async (oldPassword, { req }) => {
      const userId: string = req.user;

      const findUserId = await Authentication.findOne({
        where: { user_id: userId },
      });

      if (!findUserId) {
        throw new Error("Data Email with verified code are not found!");
      }

      // Verify old password with in DB
      const validateOldPassword: boolean = await bcrypt.compare(
        oldPassword,
        findUserId.password ? findUserId.password : ""
      );
      if (!validateOldPassword) {
        throw new Error("Incorrect Old Password");
      }

      return true;
    }),
  check("new_password")
    .notEmpty()
    .withMessage("new_password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must include at least one special character")
    .matches(/[A-Z]/)
    .withMessage("Password must include at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must include at least one number")
    .custom((newPassword, { req }) => {
      const { old_password } = req.body;
      if (old_password === newPassword) {
        throw new Error(
          "New Password is can not be same with the old password"
        );
      }
      return true;
    }),
  check("confirm_new_password")
    .notEmpty()
    .withMessage("confirm_new_password is required")
    .custom((confirmPassword, { req }) => {
      const { new_password } = req.body;
      if (new_password !== confirmPassword) {
        throw new Error("Confirm New Password is not match with new password");
      }
      return true;
    }),
];

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user;
  const { new_password } = req.body;

  const errors = validationResult(req);
  const arrayOfError: ValidationError[] = errors.array()

  if (!errors.isEmpty()) {
    return apiResponse(res, 400, arrayOfError);
  }

  try {
    const findUserById = await Authentication.findOne({ where: { user_id: userId } });

    if (findUserById) {
      findUserById.password = await encryptPassword(new_password);
      await findUserById.save();

      return apiResponse(res, 200, "Successfuly change password");
    }
  } catch (error) {
    return apiResponse(res, 500, "Server Error", {
      error: "Internal Server Error",
    });
  }
});
