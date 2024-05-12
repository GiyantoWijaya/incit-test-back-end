import { Request, Response } from 'express';
import {
  apiResponse,
  encryptPassword,
  findUser,
  generateEmailToken,
} from '../../utils/method-helper/method';
import User from '../../databases/models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { check, validationResult } from 'express-validator';
import { catchAsync } from '../../utils/method-helper/catchAsync';
import { generateTokenExpiration, now } from '../../utils/unix-epoch-date/date';
import { emailConfig, transporter } from '../../config/nodemailer';
import { templateHtmlEmail } from '../../templates/emailFormat.template';
import Authentication from '../../databases/models/authentication';
import Session from '../../databases/models/session.model';

export const validatorRegistration = [
  check('email', 'Email Format Incorrect!')
    .isEmail()
    .notEmpty()
    .bail()
    .custom(async (value) => {
      const duplicate = await findUser(value);
      if (duplicate) {
        throw new Error('Email Already Registered! Please Use Another Email');
      }
      return true;
    }),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must include at least one special character')
    .matches(/[A-Z]/)
    .withMessage('Password must include at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must include at least one number'),
  check('confirm_password')
    .notEmpty()
    .withMessage('confirm_password is required')
    .custom((confirmPassword, { req }) => {
      const { password } = req.body;
      if (password !== confirmPassword) {
        throw new Error('Password is not match with confirm password');
      }
      return true;
    }),
];

export const registration = catchAsync(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const userId = uuidv4()
  const { email, firstName, lastName, password } = req.body

  if (!errors.isEmpty()) {
    return apiResponse(res, 400, errors.array());
  }

  try {
    const user: User = await User.create({ id: userId, email, firstName, lastName });

    // generate token and token expiration
    const tokenEmail = generateEmailToken();
    const tokenExpiration = generateTokenExpiration();

    const mailOptions = {
      from: emailConfig.auth ? emailConfig.auth.user : 'init-test',
      to: email,
      subject: "Confirm Your Email Address",
      text: `Confirm the following NUMBER to confirm your email: ${tokenEmail}`,
      html: templateHtmlEmail(email, tokenEmail.toString()),
    };

    transporter.sendMail(mailOptions, async (error: Error | null, info) => {
      if (error) {
        console.error(error);
        apiResponse(res, 400, "Failed to send confirmation email");
      } else {
        console.log('email confirmation has been sended')
        // create authentication data
        const createAuthentication = await Authentication.create({
          user_id: userId,
          password: await encryptPassword(password), token_verify_email: tokenEmail, token_expired_email: tokenExpiration
        })

        // create session data
        const createSession = await Session.create({ user_id: userId, times_account_creation: now() })

        return apiResponse(
          res,
          201,
          'Registration is Successfully, Please check your email to verify your account!',
          {
            email: user.email
          },
        );
      }
    });
  } catch (error) {
    return apiResponse(res, 500, 'Server Error', {
      error: 'Internal Server Error',
    });
  }
});
