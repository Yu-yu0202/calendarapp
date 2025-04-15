import { Request, Response } from 'express';
import EventModel from '../models/Event';
import { Event } from '../types';

/**
 * ISO形式の日付文字列をMySQLのdatetime形式に変換する
 * @param dateStr ISO形式の日付文字列
 * @returns MySQL対応の日付文字列（YYYY-MM-DD HH:MM:SS）
 */
function formatDateForMySQL(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export class EventController {
  async createEvent(req: Request, res: Response) {
    try {
      console.log('イベント作成リクエスト:', req.body);

      const startDate = req.body.start_date || req.body.start;
      const endDate = req.body.end_date || req.body.end;

      const mysqlStartDate = startDate ? formatDateForMySQL(startDate) : formatDateForMySQL(new Date().toISOString());
      const mysqlEndDate = endDate ? formatDateForMySQL(endDate) : formatDateForMySQL(new Date().toISOString());

      const eventData: Event = {
        title: req.body.title,
        description: req.body.description || null,
        start_date: new Date(mysqlStartDate),
        end_date: new Date(mysqlEndDate),
        is_holiday: req.body.is_holiday || false,
        is_recurring: req.body.is_recurring || false,
        recurrence_pattern: req.body.recurrence_pattern || null,
        color: req.body.color || null,
        created_by: (req as any).user?.id || null
      };

      console.log('変換後のイベントデータ:', eventData);

      const id = await EventModel.create(eventData);
      res.status(201).json({ id, message: '予定を作成しました。' });
    } catch (error) {
      console.error('イベント作成エラー詳細:', error);
      res.status(500).json({ message: '予定の作成に失敗しました。', error: process.env.NODE_ENV !== 'production' ? (error as Error).message : undefined });
    }
  }

  async getEvent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(`イベント取得リクエスト - ID: ${id}`);
      const event = await EventModel.findById(id);
      if (!event) {
        return res.status(404).json({ message: '予定が見つかりません。' });
      }
      res.json(event);
    } catch (error) {
      console.error(`イベント取得エラー (ID: ${req.params.id}):`, error);
      res.status(500).json({ message: '予定の取得に失敗しました。', error: process.env.NODE_ENV !== 'production' ? (error as Error).message : undefined });
    }
  }

  async getAllEvents(req: Request, res: Response) {
    try {
      console.log('全イベント取得リクエスト');
      const events = await EventModel.findAll();
      console.log(`取得したイベント数: ${events.length}`);
      res.json(events);
    } catch (error) {
      console.error('全イベント取得エラー:', error);
      res.status(500).json({ message: '予定の取得に失敗しました。', error: process.env.NODE_ENV !== 'production' ? (error as Error).message : undefined });
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      const requestData = { ...req.body };
      const eventData: Partial<Event> = {};
      
      if (requestData.title !== undefined) eventData.title = requestData.title;
      if (requestData.description !== undefined) eventData.description = requestData.description;
      if (requestData.start !== undefined) {
        const mysqlDate = formatDateForMySQL(requestData.start);
        eventData.start_date = new Date(mysqlDate);
      }
      if (requestData.end !== undefined) {
        const mysqlDate = formatDateForMySQL(requestData.end);
        eventData.end_date = new Date(mysqlDate);
      }
      if (requestData.start_date !== undefined) {
        const mysqlDate = formatDateForMySQL(requestData.start_date);
        eventData.start_date = new Date(mysqlDate);
      }
      if (requestData.end_date !== undefined) {
        const mysqlDate = formatDateForMySQL(requestData.end_date);
        eventData.end_date = new Date(mysqlDate);
      }
      if (requestData.is_holiday !== undefined) eventData.is_holiday = requestData.is_holiday;
      if (requestData.is_recurring !== undefined) eventData.is_recurring = requestData.is_recurring;
      if (requestData.recurrence_pattern !== undefined) eventData.recurrence_pattern = requestData.recurrence_pattern;
      if (requestData.color !== undefined) eventData.color = requestData.color;
      
      console.log(`イベント更新リクエスト - ID: ${id}`, eventData);
      
      const success = await EventModel.update(id, eventData);
      if (!success) {
        return res.status(404).json({ message: '予定が見つかりません。' });
      }
      res.json({ message: '予定を更新しました。' });
    } catch (error) {
      console.error(`イベント更新エラー (ID: ${req.params.id}):`, error);
      res.status(500).json({ message: '予定の更新に失敗しました。', error: process.env.NODE_ENV !== 'production' ? (error as Error).message : undefined });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(`イベント削除リクエスト - ID: ${id}`);
      const success = await EventModel.delete(id);
      if (!success) {
        return res.status(404).json({ message: '予定が見つかりません。' });
      }
      res.json({ message: '予定を削除しました。' });
    } catch (error) {
      console.error(`イベント削除エラー (ID: ${req.params.id}):`, error);
      res.status(500).json({ message: '予定の削除に失敗しました。', error: process.env.NODE_ENV !== 'production' ? (error as Error).message : undefined });
    }
  }

  async getEventsByDateRange(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      console.log(`日付範囲でイベント取得リクエスト - 開始: ${startDate}, 終了: ${endDate}`);
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: '開始日と終了日は必須です。' });
      }
      
      const formattedStartDate = formatDateForMySQL(startDate as string);
      const formattedEndDate = formatDateForMySQL(endDate as string);
      
      const events = await EventModel.findByDateRange(
        new Date(formattedStartDate),
        new Date(formattedEndDate)
      );
      console.log(`日付範囲で取得したイベント数: ${events.length}`);
      res.json(events);
    } catch (error) {
      console.error(`日付範囲イベント取得エラー (${req.query.startDate} - ${req.query.endDate}):`, error);
      res.status(500).json({ message: '予定の取得に失敗しました。', error: process.env.NODE_ENV !== 'production' ? (error as Error).message : undefined });
    }
  }
}

export default new EventController();