import PDFDocument from 'pdfkit';
import { Event } from '../types';
import { PdfSetting } from '../models/PdfSetting';
import PdfSettingModel from '../models/PdfSetting';
import dayjs from 'dayjs';
import path from 'path';
import fs from 'fs';

interface PDFOptions {
  layout?: 'portrait' | 'landscape';
  backgroundImage?: string; // 背景画像のパス
  style?: 'background' | 'top' | 'left'; // 背景画像の配置スタイル
  title?: string;
  showDescription?: boolean;
  userId?: number;
}

export class PDFService {
  // ユーザー設定の取得
  async getUserSettings(userId: number): Promise<PdfSetting | null> {
    try {
      return await PdfSettingModel.findByUserId(userId);
    } catch (error) {
      console.error('PDF設定の取得に失敗しました:', error);
      return null;
    }
  }

  // メインのPDF生成関数
  async generateCalendarPDF(events: Event[], options: PDFOptions = {}): Promise<PDFKit.PDFDocument> {
    // ユーザー設定の取得
    let userSettings = null;
    if (options.userId) {
      userSettings = await this.getUserSettings(options.userId);
    }

    // 設定の統合 (ユーザー設定とリクエスト設定)
    const layout = options.layout || (userSettings?.layoutSettings?.orientation || 'landscape');
    const margins = userSettings?.layoutSettings ? {
      top: userSettings.layoutSettings.marginTop,
      right: userSettings.layoutSettings.marginRight,
      bottom: userSettings.layoutSettings.marginBottom,
      left: userSettings.layoutSettings.marginLeft,
    } : { top: 50, right: 50, bottom: 50, left: 50 };
    const fontFamily = userSettings?.fontSettings?.family || 'Helvetica';
    const fontSize = userSettings?.fontSettings?.size || 12;

    // PDFドキュメントの初期化
    const doc = new PDFDocument({
      layout,
      size: 'A4',
      margin: margins.top,
      info: {
        Title: options.title || 'カレンダー',
        Author: 'Calendar App',
        Creator: 'Calendar App',
      }
    });

    // 背景画像の設定
    this.applyBackgroundImage(doc, options);

    // フォント設定
    doc.font(fontFamily).fontSize(fontSize);

    // ヘッダーの追加（設定がある場合）
    if (userSettings?.headerSettings?.enabled) {
      doc.fontSize(fontSize + 4)
        .text(userSettings.headerSettings.content, {
          align: 'center',
          height: userSettings.headerSettings.height
        })
        .moveDown();
    }

    // デフォルトのタイトル
    doc.fontSize(fontSize + 8)
      .text(options.title || 'カレンダー', {
        align: 'center',
      })
      .moveDown();

    // 日付範囲を決定
    const eventDates = events.map(e => [new Date(e.start_date), new Date(e.end_date)]).flat();
    const minDate = eventDates.length ? new Date(Math.min(...eventDates.map(d => d.getTime()))) : new Date();
    const maxDate = eventDates.length ? new Date(Math.max(...eventDates.map(d => d.getTime()))) : new Date();
    
    // 月ごとのカレンダーを生成
    const startMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const endMonth = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);
    
    // 現在の処理月
    let currentMonth = new Date(startMonth);
    
    // 各月をレンダリング
    while (currentMonth <= endMonth) {
      this.renderMonthCalendar(doc, currentMonth, events, {
        showDescription: options.showDescription || false,
        fontSize
      });
      
      // 次の月へ
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      
      // 最後の月でなければ改ページ
      if (currentMonth <= endMonth) {
        doc.addPage();
        
        // 複数ページの場合、各ページに背景画像を適用
        this.applyBackgroundImage(doc, options);
      }
    }

    // フッターの追加（設定がある場合）
    if (userSettings?.footerSettings?.enabled) {
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        const pageHeight = doc.page.height;
        doc.fontSize(fontSize - 2)
          .text(
            userSettings.footerSettings.content,
            margins.left,
            pageHeight - margins.bottom - userSettings.footerSettings.height,
            { align: 'center' }
          );
      }
    }

    doc.end();
    return doc;
  }

  // 背景画像を適用
  private applyBackgroundImage(doc: PDFKit.PDFDocument, options: PDFOptions): void {
    if (!options.backgroundImage) return;

    let imagePath = options.backgroundImage;
    
    // 相対パスの場合は絶対パスに変換
    if (!path.isAbsolute(imagePath)) {
      imagePath = path.resolve(process.cwd(), 'public', 'uploads', imagePath);
    }

    // 画像ファイルが存在するか確認
    if (!fs.existsSync(imagePath)) {
      console.warn(`背景画像が見つかりません: ${imagePath}`);
      return;
    }

    const style = options.style || 'background';

    try {
      switch (style) {
        case 'background':
          // 全体を覆う背景として配置
          doc.image(imagePath, 0, 0, {
            width: doc.page.width,
            height: doc.page.height,
            align: 'center',
            valign: 'center'
          });
          break;
        
        case 'top':
          // 上部に配置
          doc.image(imagePath, 50, 50, {
            width: doc.page.width - 100,
            height: 200,
            align: 'center'
          });
          doc.moveDown(14); // 画像の下にコンテンツを表示するため
          break;
        
        case 'left':
          // 左側に配置
          doc.image(imagePath, 50, 50, {
            width: 200,
            height: doc.page.height - 100,
            valign: 'center'
          });
          // 左マージンを調整
          doc.text('', 270, 50);
          break;
      }
    } catch (error) {
      console.error(`背景画像の適用に失敗しました: ${error}`);
    }
  }

  // 月のカレンダーをレンダリング
  private renderMonthCalendar(doc: PDFKit.PDFDocument, month: Date, events: Event[], options: { showDescription: boolean, fontSize: number }) {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const monthName = new Intl.DateTimeFormat('ja-JP', { month: 'long' }).format(month);
    
    // 月のタイトル
    doc.fontSize(options.fontSize + 4)
      .text(`${year}年 ${monthName}`, {
        align: 'center'
      })
      .moveDown();
    
    // 当月の日数を取得
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    // 月の最初の日の曜日を取得 (0: 日曜日, 6: 土曜日)
    const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
    
    // カレンダーのグリッドを作成
    const cellWidth = (doc.page.width - 100) / 7;
    const cellHeight = 80;
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    
    // 曜日のヘッダー
    doc.fontSize(options.fontSize)
      .fill('#000000');
    
    // ヘッダー行の背景
    doc.rect(50, doc.y, doc.page.width - 100, 30)
      .fill('#f2f2f2');
    
    // 曜日名
    dayNames.forEach((day, i) => {
      const x = 50 + i * cellWidth;
      const color = (i === 0) ? '#FF0000' : (i === 6) ? '#0000FF' : '#000000';
      doc.fontSize(options.fontSize)
        .fill(color)
        .text(day, x + cellWidth / 2, doc.y - 25, {
          width: cellWidth,
          align: 'center'
        });
    });
    
    doc.moveDown();
    
    // カレンダーのグリッドを描画
    let currentDay = 1;
    const rows = Math.ceil((firstDayOfMonth + daysInMonth) / 7);
    
    for (let row = 0; row < rows; row++) {
      const y = doc.y;
      
      // セル背景と罫線
      for (let col = 0; col < 7; col++) {
        const x = 50 + col * cellWidth;
        doc.rect(x, y, cellWidth, cellHeight)
          .stroke('#cccccc');
      }
      
      // 日付とイベント
      for (let col = 0; col < 7; col++) {
        if ((row === 0 && col < firstDayOfMonth) || currentDay > daysInMonth) {
          // 当月の日付範囲外はスキップ
          continue;
        }
        
        const x = 50 + col * cellWidth;
        const date = new Date(year, monthIndex, currentDay);
        const dateStr = `${currentDay}`;
        
        // 日付の色 (日曜: 赤, 土曜: 青, その他: 黒)
        const color = (col === 0) ? '#FF0000' : (col === 6) ? '#0000FF' : '#000000';
        
        // 日付を描画
        doc.fill(color)
          .text(dateStr, x + 5, y + 5, {
            width: cellWidth - 10,
            align: 'left'
          });
        
        // その日のイベントを抽出
        const dayEvents = events.filter(event => {
          const start = new Date(event.start_date);
          const end = new Date(event.end_date);
          return (
            (date >= start && date <= end) || 
            (dayjs(date).format('YYYY-MM-DD') === dayjs(start).format('YYYY-MM-DD'))
          );
        });
        
        // イベントを描画
        if (dayEvents.length > 0) {
          let eventY = y + 20;
          const maxEventsToShow = 3; // 1日に表示する最大イベント数
          
          dayEvents.slice(0, maxEventsToShow).forEach(event => {
            // イベントの表示
            const title = event.title.length > 15 ? event.title.substring(0, 12) + '...' : event.title;
            
            // イベント背景色
            const bgColor = event.color || (event.is_holiday ? '#FF6666' : '#4285F4');
            doc.rect(x + 5, eventY, cellWidth - 10, 15)
              .fill(bgColor);
            
            // イベントテキスト
            doc.fill('#FFFFFF')
              .fontSize(options.fontSize - 2)
              .text(title, x + 7, eventY + 2, {
                width: cellWidth - 14
              });
            
            // 説明文表示オプションがオンの場合
            if (options.showDescription && event.description) {
              eventY += 17;
              const description = event.description.length > 20 
                ? event.description.substring(0, 17) + '...' 
                : event.description;
              
              doc.fill('#333333')
                .fontSize(options.fontSize - 3)
                .text(description, x + 7, eventY, {
                  width: cellWidth - 14
                });
            }
            
            eventY += 17;
          });
          
          // 表示しきれないイベントがある場合
          if (dayEvents.length > maxEventsToShow) {
            doc.fill('#000000')
              .fontSize(options.fontSize - 2)
              .text(`+${dayEvents.length - maxEventsToShow} more`, x + 5, eventY, {
                width: cellWidth - 10
              });
          }
        }
        
        currentDay++;
      }
      
      doc.moveDown(cellHeight / doc.currentLineHeight());
    }
    
    return doc;
  }
}

export default new PDFService();