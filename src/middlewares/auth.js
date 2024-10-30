const passport = require('passport');

const authenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Authentication failed.' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized access.' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

module.exports = authenticate;
