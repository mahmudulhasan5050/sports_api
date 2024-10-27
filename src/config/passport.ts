import passport from 'passport';
import JwtStrategy from 'passport-jwt';
import GoogleStrategy from 'passport-google-oauth20';

import authServices from '../services/auth';

import { secretAuth } from '../utils/secrets';

import User, { IUser } from '../models/User';

interface JwtPayloadType {
  sub: string;
  name: string;
  iat: number;
  exp: number;
}

const jwtOptions = {
  jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretAuth,
};

export const jwtStrategy = new JwtStrategy.Strategy(
  jwtOptions,
  async (jwt_payload: JwtPayloadType, done: JwtStrategy.VerifiedCallback) => {
    try {
      const user = await User.findById(jwt_payload.sub);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }
);

export const googleStrategy = new GoogleStrategy.Strategy(
  {
    clientID:
      '1087861861596-vtstrr7nbu7ut3s1l5k9kpclgiq16gov.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5000/api/v1/auth/google/redirect',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0].value;
      if (email) {
        const user = await User.findOne({ email });
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            name: profile.displayName,
            googleId: profile.id,
            email: email,
            isValid: true,
          });
          const user = await authServices.googleRegister(newUser);
          if (user) {
            return done(null, user);
          } else {
            return done(new Error('Data could not be saved!'));
          }
        }
      } else {
        return done(new Error('No email found!'));
      }
    } catch (error) {
      return done(error, false);
    }
  }
);
