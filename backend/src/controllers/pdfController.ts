import { Request, Response } from 'express';
import pdfService from '../services/pdfService';
import EventModel from '../models/Event';

export class PDFController {
  async generatePDF(req: Request, res: Response) {
    try {
      const { 
        startDate, 
        endDate, 
        title, 
        layout, 
        format,
        showDescription,
        showTime
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
        format,
        showDescription,
        showTime,
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