import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    is_admin: boolean;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: '認証が必要です。' });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, config.jwt.secret) as {
      id: number;
      username: string;
      is_admin: boolean;
    };
    next();
  } catch (error) {
    res.status(401).json({ message: '無効なトークンです。' });
  }
};

export const adminAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ message: '管理者権限が必要です。' });
  }
  next();
};