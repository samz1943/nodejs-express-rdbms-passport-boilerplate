const config = require('./config')
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt_secret,
};

passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
        try {
            const user = await User.findByPk(jwtPayload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
        } catch (err) {
            return done(err, false);
        }
    })
);

module.exports = passport;
