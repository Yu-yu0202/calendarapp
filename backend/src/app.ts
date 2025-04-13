import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import eventRoutes from './routes/eventRoutes';
import authRoutes from './routes/authRoutes';
import pdfRoutes from './routes/pdfRoutes';
import './routes/pdfRoutes'
import userRoutes from './routes/userRoutes';
import https from 'https';
import fs from 'fs';
import config from './config/config';

dotenv.config();

const app = express();

// カスタムロギング用のミドルウェア
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Request received`);
  console.log('Request Headers:', req.headers);
  
  // レスポンス送信後のログ
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Response sent: ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Morganロガーの設定
app.use(morgan('dev'));

// CORSの設定 - 開発環境では全てのオリジンを許可
app.use(cors({
  origin: true, // すべてのオリジンを許可
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルートの設定
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/users', userRoutes);

// エラーハンドリング
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: process.env.NODE_ENV === 'production' ? 'サーバーエラーが発生しました。' : err.message,
  });
});

const PORT = parseInt(process.env.PORT || '3000', 10);

if (config.ssl.enabled) {
  const options = {
    key: fs.readFileSync(config.ssl.sslkeypath),
    cert: fs.readFileSync(config.ssl.sslcertpath)
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPSサーバーがポート${PORT}で起動しました。`);
  });
} else {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HTTPサーバーがポート${PORT}で起動しました (全てのインターフェースでリッスン中)`);
  });
}

export default app;