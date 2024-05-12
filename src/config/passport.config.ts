import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { findUser } from '../utils/method-helper/method';
import User from '../databases/models/user.model';
import Authentication from '../databases/models/authentication';


// Passport local strategy configuration
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email", // Use email as the username field
    },
    async (email: string, password: string, done) => {
      try {
        const user: User | null = await findUser(email);
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        const userAuth = await Authentication.findOne({ where: { user_id: user.id } })
        if (!userAuth) return done(null, false, { message: "Account Not Found" });

        const isPasswordValid: boolean = await bcrypt.compare(password, userAuth.password ? userAuth.password : "");
        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user for session storage
passport.serializeUser<any, any>((req: Request, user, done) => {
  done(undefined, user);
});

// Deserialize user from session storage
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
