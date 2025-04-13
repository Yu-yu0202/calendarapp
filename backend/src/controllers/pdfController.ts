import { Request, Response } from 'express';
import pdfService from '../services/pdfService';
import EventModel from '../models/Event';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

// 背景画像アップロード用の設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // アップロードディレクトリがなければ作成
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // ユニークなファイル名を生成
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'bg-' + uniqueSuffix + ext);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // 画像ファイルのみ許可
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('画像ファイルのみアップロード可能です'));
    }
    cb(null, true);
  }
});

export class PDFController {
  // 背景画像アップロード
  async uploadBackground(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'ファイルがアップロードされていません' });
      }
      
      // アップロードされたファイルのパスを返す
      const filePath = req.file.filename;
      res.json({
        message: '画像アップロードが完了しました',
        path: filePath
      });
    } catch (error) {
      console.error('アップロードエラー:', error);
      res.status(500).json({ message: '画像のアップロードに失敗しました' });
    }
  }
  
  // 背景画像一覧取得
  async listBackgrounds(req: Request, res: Response) {
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // ディレクトリが存在しない場合は作成
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        return res.json({ backgrounds: [] });
      }
      
      // 画像ファイルのみをフィルタリング
      const files = fs.readdirSync(uploadDir)
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext) && file.startsWith('bg-');
        })
        .map(file => ({
          name: file,
          path: file,
          url: `/uploads/${file}`
        }));
      
      res.json({ backgrounds: files });
    } catch (error) {
      console.error('背景画像リスト取得エラー:', error);
      res.status(500).json({ message: '背景画像リストの取得に失敗しました' });
    }
  }

  // PDF生成
  async generatePDF(req: Request, res: Response) {
    try {
      const { 
        startDate, 
        endDate, 
        title, 
        layout, 
        backgroundImage,
        style,
        showDescription
      } = req.body;

      // バリデーション
      if (!startDate || !endDate) {
        return res.status(400).json({ message: '開始日と終了日は必須です。' });
      }

      // イベントの取得
      const events = await EventModel.findByDateRange(
        new Date(startDate),
        new Date(endDate)
      );

      // ユーザーID取得（認証されている場合）
      const userId = (req as any).user?.id;

      // PDFの生成
      const doc = await pdfService.generateCalendarPDF(events, {
        title,
        layout,
        backgroundImage,
        style,
        showDescription,
        userId
      });

      // レスポンスヘッダーの設定
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition', 
        `attachment; filename=calendar_${startDate}_${endDate}.pdf`
      );

      // PDFのストリーミング
      doc.pipe(res);

    } catch (error) {
      console.error('PDF生成エラー:', error);
      res.status(500).json({ message: 'PDFの生成に失敗しました。' });
    }
  }
}

export default new PDFController();