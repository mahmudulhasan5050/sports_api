import passport from 'passport';
import JwtStrategy from 'passport-jwt';

import {
  secretAuth,
} from '../utils/secrets';

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
