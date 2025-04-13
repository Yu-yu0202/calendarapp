import { Request, Response } from 'express';
import EventModel from '../models/Event';
import { Event } from '../types';

export class EventController {
  async createEvent(req: Request, res: Response) {
    try {
      const event: Event = req.body;
      console.log('イベント作成リクエスト:', event);
      const id = await EventModel.create(event);
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
      const event: Partial<Event> = req.body;
      console.log(`イベント更新リクエスト - ID: ${id}`, event);
      const success = await EventModel.update(id, event);
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
      
      const events = await EventModel.findByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
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