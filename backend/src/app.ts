import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes';
import authRoutes from './routes/authRoutes';
import pdfRoutes from './routes/pdfRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルートの設定
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes as unknown as express.RequestHandler);
app.use('/api/users', userRoutes);

// エラーハンドリング
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'サーバーエラーが発生しました。' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました。`);
});

export default app;