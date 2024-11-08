import { Request, Response, NextFunction } from 'express';
import passport from '../config/passport';
import { User } from '../entities/User';

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: any, user: User) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication failed. ' + err.message });
    }
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export default authenticate;
