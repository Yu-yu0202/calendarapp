import { Request, Response } from 'express';
import pdfService from '../services/pdfService';
import EventModel from '../models/Event';

export class PDFController {
  async generatePDF(req: Request, res: Response) {
    try {
      const { startDate, endDate, layout, backgroundImage, style } = req.body;

      // イベントの取得
      const events = await EventModel.findByDateRange(
        new Date(startDate),
        new Date(endDate)
      );

      // PDFの生成
      const doc = await pdfService.generateCalendarPDF(events, {
        layout,
        backgroundImage,
        style
      });

      // レスポンスヘッダーの設定
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=calendar.pdf');

      // PDFのストリーミング
      doc.pipe(res);

    } catch (error) {
      res.status(500).json({ message: 'PDFの生成に失敗しました。' });
    }
  }
}

export default new PDFController();