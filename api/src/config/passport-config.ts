import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import LinkedinStrategy from 'passport-linkedin-oauth2';
import { GOOGLE_KEY, LINKEDIN_KEY } from './keys';
import { UserModel } from '../Models/User';
import { CalendarCredentialsModel } from '../Models/CalendarCredentials';

const calendarEventCreationEmail = async (
  email: any,
  refresh_token: string,
) => {
  if (email !== process.env.CREATE_CALENDER_EMAIL) return;

  const currCredentials: any = await CalendarCredentialsModel.findOne({
    email,
  });

  if (!currCredentials) {
    const newCalenderCredential = new CalendarCredentialsModel({
      email,
      refresh_token,
    });
    return newCalenderCredential.save();
  }

  // Refresh token updated
  currCredentials.refresh_token = refresh_token;
  currCredentials.save();
};

const createUserIfNotExists = async (
  user: any,
  loginMode: string,
  done: GoogleStrategy.VerifyCallback,
) => {
  try {
    const currUser = await UserModel.findOne({ email: user.email });

    if (loginMode === 'true') {
      if (currUser) return done(null, currUser);

      return done('Email is not registered, please sign up first!');
    }

    if (loginMode === 'false') {
      if (currUser) return done('Email already registered');

      if (
        !user.is_mentor &&
        !/^[A-Za-z0-9._%+-]+@thapar.edu$/i.test(user.email)
      ) {
        return done('Mentee must use thapar.edu email');
      }

      await user.save();
      return done(null, user);
    }
  } catch (err: any) {
    done(err, undefined);
  }
};

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy.Strategy(
    { ...GOOGLE_KEY, passReqToCallback: true },
    (request, _accessToken, _refreshToken, profile, done) => {
      const state = JSON.parse((request.query.state as string) || '{}');

      calendarEventCreationEmail(profile._json.email, _refreshToken);

      const user = new UserModel({
        user_id: profile.id,
        first_name: profile._json?.given_name,
        last_name: profile._json?.family_name,
        email: profile._json?.email,
        image_link: profile._json?.picture,
        oauth_provider: profile.provider,
        is_mentor: state.isMentor === 'true',
        verified: true,
      });

      createUserIfNotExists(user, state.loginMode, done);
    },
  ),
);

passport.use(
  new LinkedinStrategy.Strategy(
    {
      ...LINKEDIN_KEY,
      scope: ['r_emailaddress', 'r_liteprofile'],
      passReqToCallback: true,
    },
    (request, _accessToken, _refreshToken, profile, done) => {
      const state = JSON.parse((request.query.state as string) || '{}');

      const user = new UserModel({
        user_id: profile.id,
        first_name: profile.name?.givenName,
        last_name: profile.name?.familyName,
        email: profile.emails[0].value,
        image_link: profile._json?.profilePicture?.displayImage,
        oauth_provider: profile.provider,
        is_mentor: state.isMentor,
        verified: true,
      });

      createUserIfNotExists(user, state.loginMode, done);
    },
  ),
);
