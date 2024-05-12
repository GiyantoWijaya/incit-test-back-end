import { Request, Response } from 'express';
import User from '../../databases/models/user.model';
import { apiResponse, generateEmailToken } from '../../utils/method-helper/method';
import { generateTokenExpiration, now } from '../../utils/unix-epoch-date/date';
import { catchAsync } from '../../utils/method-helper/catchAsync';
import { emailConfig, transporter } from '../../config/nodemailer';
import Authentication from '../../databases/models/authentication';
import { templateHtmlEmail } from '../../templates/emailFormat.template';

export const generateEmailTokenVerified = catchAsync(async (req: Request, res: Response) => {
  const emailUser: string = req.body.email;
  emailUser ? null : apiResponse(res, 400, "Request Body Email is required");

  try {
    const findUser = await User.findOne({ where: { email: emailUser } });
    if (!findUser) return apiResponse(res, 404, "User Email is not found");

    const findAuthentications = await Authentication.findOne({ where: { user_id: findUser.id } })
    if (!findAuthentications) return apiResponse(res, 404, "User Email is not found");

    // generate token and token expiration
    const tokenEmail = generateEmailToken();
    const tokenExpiration = generateTokenExpiration();

    const mailOptions = {
      from: emailConfig.auth ? emailConfig.auth.user : 'RealmProtector',
      to: emailUser,
      subject: "Confirm Your Email Address",
      text: `Confirm the following NUMBER to confirm your email: ${tokenEmail}`,
      html: templateHtmlEmail(emailUser, tokenEmail.toString()),
    };

    transporter.sendMail(mailOptions, async (error: Error | null, info) => {
      if (error) {
        console.error(error);
        apiResponse(res, 400, "Failed to send confirmation email");
      } else {

        console.log("Confirmation Email sent:", info.response);
        findAuthentications.token_verify_email = tokenEmail;
        findAuthentications.token_expired_email = tokenExpiration;
        await findAuthentications.save();
        apiResponse(res, 200, "Confirmation email sent successfully");
      }
    });
  } catch (error) {
    return apiResponse(res, 500, "Server Error", {
      error: "Internal Server Error",
    });
  }
});

export const verifyEmailToken = catchAsync(async (req: Request, res: Response) => {
  const emailUser: string = req.body.email;
  const token: number = parseInt(req.body.token);
  console.log(emailUser, token)
  emailUser ? null : apiResponse(res, 400, "Request Body Email is required");
  token ? null : apiResponse(res, 400, "Request Body Token is required");

  try {
    const findUser = await User.findOne({ where: { email: emailUser } });

    if (!findUser)
      return apiResponse(
        res,
        401,
        "Email is not registered, please register first and verified your email"
      );

    const findAuthentications = await Authentication.findOne({ where: { user_id: findUser.id } })
    if (!findAuthentications) return apiResponse(res, 401, "Email is not registered, please register first and verified your email");


    if (findAuthentications.token_verify_email !== token || findAuthentications.token_expired_email == undefined) {
      return apiResponse(
        res,
        401,
        "Invalid Token Code, please input the correct token code from your email"
      );
    }
    // check expiration

    const difTime = now() - findAuthentications.token_expired_email;
    if (difTime >= 0) {
      return apiResponse(
        res,
        401,
        "Token Already Expired, Please Regenerate Your Token"
      );
    }

    findAuthentications.is_verified = true;
    await findAuthentications.save();

    return apiResponse(res, 200, "Authentication Email Successfully.");
  } catch (error) {
    return apiResponse(res, 500, "Server Error", {
      error: "Internal Server Error",
    });
  }
});
