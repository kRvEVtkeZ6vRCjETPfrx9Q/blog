import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: any;
}

export default function (req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: 'No session, authorization denied' });
  }
  req.user = { userId: req.session.userId };
  next();
}
