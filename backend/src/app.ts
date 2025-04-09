import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルートの設定
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/users', userRoutes);

// エラーハンドリング
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'サーバーエラーが発生しました。' });
});

const PORT = process.env.PORT || 3000;

const options = {
  key: fs.readFileSync(config.ssl.sslkeypath),
  cert: fs.readFileSync(config.ssl.sslcertpath)
};

if (config.ssl.enabled) {
  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPSサーバーがポート${PORT}で起動しました。`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`HTTPサーバーがポート${PORT}で起動しました。`);
  });
}

export default app;