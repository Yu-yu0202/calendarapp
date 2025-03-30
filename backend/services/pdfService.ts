import PDFDocument from 'pdfkit';
import { Event } from '../types';

interface PDFOptions {
  layout: 'portrait' | 'landscape';
  backgroundImage?: string;
  style: 'background' | 'top' | 'left';
}

export class PDFService {
  async generateCalendarPDF(events: Event[], options: PDFOptions): Promise<PDFKit.PDFDocument> {
    const doc = new PDFDocument({
      layout: options.layout,
      size: 'A4',
      margin: 50
    });

    // 背景画像の設定
    if (options.backgroundImage) {
      switch (options.style) {
        case 'background':
          doc.image(options.backgroundImage, 0, 0, {
            width: doc.page.width,
            height: doc.page.height
          });
          break;
        case 'top':
          doc.image(options.backgroundImage, 50, 50, {
            width: doc.page.width - 100,
            height: 200
          });
          break;
        case 'left':
          doc.image(options.backgroundImage, 50, 50, {
            width: 200,
            height: doc.page.height - 100
          });
          break;
      }
    }

    // カレンダーのヘッダー
    doc.fontSize(24).text('カレンダー', {
      align: 'center'
    });

    // イベントの描画
    doc.fontSize(12);
    events.forEach(event => {
      doc.moveDown()
        .text(`${event.title}`)
        .text(`日付: ${event.start_date.toLocaleDateString()} - ${event.end_date.toLocaleDateString()}`)
        .text(`説明: ${event.description || ''}`)
        .moveDown();
    });

    doc.end();
    return doc;
  }
}

export default new PDFService();