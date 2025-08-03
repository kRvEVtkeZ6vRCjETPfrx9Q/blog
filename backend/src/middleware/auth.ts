import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

export interface AuthRequest extends Request {
  session: session.Session & { userId?: string };
  user?: any;
}

export default function (req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.user = { userId: req.session.userId };
  next();
}
