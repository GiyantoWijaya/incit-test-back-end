import { Request, Response, NextFunction } from "express";
import passport from "passport";
import "../../config/passport.config";
import { createToken, apiResponse } from "../../utils/method-helper/method";
import { catchAsync } from "../../utils/method-helper/catchAsync";
import { now } from "../../utils/unix-epoch-date/date";
import Session from "../../databases/models/session.model";
import User from "../../databases/models/user.model";
import Authentication from "../../databases/models/authentication";


export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Check anyfield must be not empty
  const requiredFields = ["email", "password"];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return apiResponse(res, 400, `${field} is required`);
    }
  }

  await passport.authenticate("local", async (err: any, user: User, info: any) => {
    const findUserByEmail = await User.findOne({ where: { email: req.body.email } });
    if (!findUserByEmail) {
      return apiResponse(res, 404, "User are not found!")
    }
    const userId = findUserByEmail.id
    const findUserStatusByEmail = await Authentication.findOne({
      where: { user_id: userId },
    });
    if (err) {
      console.error("Passport Error:", err);
      return apiResponse(res, 500, "Server Error", { error: "Passport Error" });
    }

    // Password Invalid handling
    if (!user) {
      return apiResponse(res, 401, "Email or Password is invalid");
    }

    // Email verified checking
    if (findUserStatusByEmail?.is_verified === false) {
      return apiResponse(
        res,
        403,
        "Email is not verified, Please verify your email first"
      );
    }

    try {
      // Generate a token
      const token = createToken(user.id);
      // expiration date token
      const max_age = process.env.MAX_AGE || "157680000"
      const expirationTime = now() + parseInt(max_age);

      const existingSession = await Session.findOne({
        where: { user_id: user.id },
      });

      // update or create User_Status login info
      if (existingSession) {
        // if (existingSession.is_active === true) {
        //   return 
        // }
        existingSession.jwt_token = token;
        existingSession.token_expiration = expirationTime;
        existingSession.last_logged_in_at = now();
        existingSession.times_logged_in = existingSession.times_logged_in + 1;
        existingSession.is_active = true;
        await existingSession.save();
      } else {
        await Session.create({
          user_id: user.id,
          jwt_token: token,
          token_expiration: expirationTime,
          last_logged_in_at: now(),
          times_logged_in: 1,
          is_active: true
        });
      }
      // Set token as an HTTP cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: parseInt(max_age) * 1000,
      });

      apiResponse(res, 200, "Login Successful!", {
        email: user.email,
        // username: user.username,
        jwt_token: token,
      });
    } catch (error) {
      return apiResponse(res, 500, "Server Error", {
        error: "Internal Server Error",
      });
    }
  })(req, res, next);
});
