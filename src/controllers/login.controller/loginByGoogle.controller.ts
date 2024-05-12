import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/method-helper/catchAsync";
import { OAuth2Client } from "google-auth-library";
import { apiResponse, createToken } from "../../utils/method-helper/method";
import User from "../../databases/models/user.model";
import Session from "../../databases/models/session.model";
import { now } from "../../utils/unix-epoch-date/date";
import Authentication from "../../databases/models/authentication";
import { v4 as uuidv4 } from 'uuid';


export const loginByGoogle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { credential, client_id } = req.body;
  let userId: string = "";
  let oauthUserId: string = "";
  let oauthEmail: string = "";
  let firstName: string = "";
  let lastName: string = "";
  let payload: any = "";
  let token: string = "";
  // expiration date token
  const max_age = process.env.MAX_AGE || "157680000"
  const expirationTime = now() + parseInt(max_age);

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  let ticket: any = {};

  try {
    // access token verify
    ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    if (!ticket) return apiResponse(res, 400, "Payload is empty")

    // sign payload
    payload = ticket.getPayload();
    firstName = payload.given_name;
    lastName = payload.family_name;
    oauthUserId = payload.sub;
    oauthEmail = payload.email;


    const findEmail = await User.findOne({ where: { email: oauthEmail } })
    // if already register but not using google
    if (findEmail) {
      // Generate a token
      token = createToken(findEmail.id);
      const findSession = await Session.findOne({ where: { user_id: findEmail.id } })
      const findAuthentication = await Authentication.findOne({ where: { user_id: findEmail.id } })
      // check update or create session
      if (findSession) {
        findSession.jwt_token = token
        findSession.token_expiration = expirationTime
        findSession.last_logged_in_at = now()
        findSession.times_logged_in = findSession.times_logged_in + 1
        findSession.is_active = true
        await findSession.save()
      } else {
        await Session.create({
          user_id: findEmail.id,
          jwt_token: token,
          token_expiration: expirationTime,
          last_logged_in_at: now(),
          times_logged_in: 1,
          is_active: true
        })
      }
      // check update or create authentication
      if (findAuthentication) {
        findAuthentication.user_id = findEmail.id
        findAuthentication.google_authentication_id = oauthUserId
        findAuthentication.is_verified = true
        await findAuthentication.save()
      }
      return apiResponse(res, 200, "Login With Google Are Suksess", { token })


      // check if the user is very first time login
    } else {
      // not register all
      const userId = uuidv4()
      token = createToken(userId);
      const createUser = await User.create({
        id: userId,
        email: oauthEmail,
        firstName: firstName,
        lastName: lastName
      })
      const createSession = await Session.create({
        user_id: userId,
        jwt_token: token,
        token_expiration: expirationTime,
        last_logged_in_at: now(),
        times_logged_in: 1,
        is_active: true,
        times_account_creation: now()
      })
      const createAuthentication = await Authentication.create({
        user_id: userId,
        google_authentication_id: oauthUserId,
        is_verified: true
      })
      return apiResponse(res, 201, "Login With Google Are Suksess", { token })
    }
  } catch (e) {
    return apiResponse(res, 404, "Authentication google failed", (e as Error).message)
  }

});
