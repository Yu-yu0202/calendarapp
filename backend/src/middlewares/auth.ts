import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

interface UserPayload {
  id: number;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  console.log('認証ミドルウェアが呼び出されました:', req.method, req.url);
  console.log('認証ヘッダー:', req.headers['authorization'] ? 'あり' : 'なし');
  
  // OPTIONSリクエストはプリフライトであるため認証をスキップ
  if (req.method === 'OPTIONS') {
    console.log('OPTIONSリクエストのため認証をスキップします');
    return next();
  }
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('認証トークンがありません');
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    if (typeof config.jwt.secret !== 'string') {
      console.error('JWT設定エラー: シークレットキーが設定されていません');
      throw new Error('JWT secret is not properly configured');
    }

    console.log('トークンを検証します...');
    const decoded = jwt.verify(token, config.jwt.secret) as UserPayload;
    req.user = decoded;
    console.log('認証成功 - ユーザー:', decoded.username, '(ID:', decoded.id, ')', '権限:', decoded.role);
    next();
  } catch (err) {
    console.error('トークン検証エラー:', err);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  console.log('管理者認証ミドルウェアが呼び出されました:', req.method, req.url);
  // 認証をまず確認
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('管理者認証: トークンがありません');
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    if (typeof config.jwt.secret !== 'string') {
      console.error('JWT設定エラー: シークレットキーが設定されていません');
      throw new Error('JWT secret is not properly configured');
    }

    console.log('管理者認証: トークンを検証します...');
    const decoded = jwt.verify(token, config.jwt.secret) as UserPayload;
    req.user = decoded;
    
    // 管理者権限を確認
    if (req.user.role !== 'admin') {
      console.log('管理者権限がありません - ユーザー:', decoded.username, '権限:', decoded.role);
      return res.status(403).json({ message: 'Admin privileges required' });
    }
    
    console.log('管理者認証成功 - ユーザー:', decoded.username, '(ID:', decoded.id, ')');
    next();
  } catch (err) {
    console.error('管理者認証: トークン検証エラー:', err);
    return res.status(403).json({ message: 'Invalid token' });
  }
};