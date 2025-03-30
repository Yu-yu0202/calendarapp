import { Request, Response } from 'express';
import EventModel from '../models/Event';
import { Event } from '../types';

export class EventController {
  async createEvent(req: Request, res: Response) {
    try {
      const event: Event = req.body;
      const id = await EventModel.create(event);
      res.status(201).json({ id, message: '予定を作成しました。' });
    } catch (error) {
      res.status(500).json({ message: '予定の作成に失敗しました。' });
    }
  }

  async getEvent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const event = await EventModel.findById(id);
      if (!event) {
        return res.status(404).json({ message: '予定が見つかりません。' });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: '予定の取得に失敗しました。' });
    }
  }

  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await EventModel.findAll();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: '予定の取得に失敗しました。' });
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const event: Partial<Event> = req.body;
      const success = await EventModel.update(id, event);
      if (!success) {
        return res.status(404).json({ message: '予定が見つかりません。' });
      }
      res.json({ message: '予定を更新しました。' });
    } catch (error) {
      res.status(500).json({ message: '予定の更新に失敗しました。' });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const success = await EventModel.delete(id);
      if (!success) {
        return res.status(404).json({ message: '予定が見つかりません。' });
      }
      res.json({ message: '予定を削除しました。' });
    } catch (error) {
      res.status(500).json({ message: '予定の削除に失敗しました。' });
    }
  }

  async getEventsByDateRange(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const events = await EventModel.findByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: '予定の取得に失敗しました。' });
    }
  }
}

export default new EventController();