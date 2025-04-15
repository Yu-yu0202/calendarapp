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
import path from 'path';
import config from './config/config';
import { validateEnv } from './config/config';

// .envファイルをロード
dotenv.config();

// 環境変数をバリデーション
try {
  validateEnv();
} catch (error) {
  console.error('環境変数の検証に失敗しました:', error);
  process.exit(1);
}

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

// CORSの設定 - 環境変数から許可オリジンを取得
const corsOriginsEnv = process.env.CORS_ALLOWED_ORIGINS || '';
// デフォルトのオリジンリスト
let allowedOrigins = [
  'http://localhost:5173'
  // add your origin here...
];

// 環境変数が設定されている場合は上書き
if (corsOriginsEnv) {
  // カンマ区切りの文字列を配列に変換
  allowedOrigins = corsOriginsEnv.split(',');
  console.log('CORS設定: 環境変数から以下のオリジンを許可リストに追加しました', allowedOrigins);
}

// CORS設定を適用
app.use(cors({
  origin: function(origin, callback) {
    // オリジンがnull（同一オリジン）または許可リストにある場合
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS: オリジン ${origin} からのリクエストを拒否しました`);
      callback(new Error('CORS policy: Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// プリフライトリクエストのキャッシュ時間を設定
app.options('*', cors());

// リクエスト本文解析の制限を増やす
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静的ファイルの配信設定
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
const uploadsDir = path.join(publicDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

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
const HOST = process.env.HOST || '0.0.0.0';

console.log(`サーバー起動設定 - ポート: ${PORT}, ホスト: ${HOST}`);

// SSLの設定
const SSL_ENABLED = process.env.SSL_ENABLED === 'true';

if (SSL_ENABLED) {
  try {
    // SSL証明書の読み込み
    const options = {
      key: fs.readFileSync(config.ssl.sslkeypath),
      cert: fs.readFileSync(config.ssl.sslcertpath)
    };
    
    // HTTPSサーバーを起動
    https.createServer(options, app).listen(PORT, HOST, () => {
      console.log(`HTTPSサーバーがポート${PORT}で起動しました (${HOST}でリッスン中)`);
    });
  } catch (error) {
    console.error('SSL証明書の読み込みに失敗しました:', error);
    console.log('HTTPモードでサーバーを起動します。');
    
    // SSLなしで起動
    app.listen(PORT, HOST, () => {
      console.log(`HTTPサーバーがポート${PORT}で起動しました (${HOST}でリッスン中) - SSL無効`);
    });
  }
} else {
  // HTTPサーバーを起動
  app.listen(PORT, HOST, () => {
    console.log(`HTTPサーバーがポート${PORT}で起動しました (${HOST}でリッスン中)`);
  });
}

export default app;