import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import User from '../models/user';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import config from '.';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt_secret,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOneBy({ id: jwtPayload.id });
      // const user = await User.findByPk(jwtPayload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
