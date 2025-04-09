import client from './client';
import { Event, CreateEventPayload, UpdateEventPayload } from '../types/event';

const EVENTS_URL = '/events';

export const fetchEvents = async (startDate?: string, endDate?: string): Promise<Event[]> => {
  try {
    let url = EVENTS_URL;
    if (startDate && endDate) {
      url = `${url}?start=${startDate}&end=${endDate}`;
    }
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    console.error('イベントの取得に失敗しました:', error);
    throw error;
  }
};

export const fetchEventById = async (id: number): Promise<Event> => {
  try {
    const response = await client.get(`${EVENTS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`イベント(ID: ${id})の取得に失敗しました:`, error);
    throw error;
  }
};

export const createEvent = async (eventData: CreateEventPayload): Promise<Event> => {
  try {
    const response = await client.post(EVENTS_URL, eventData);
    return response.data;
  } catch (error) {
    console.error('イベントの作成に失敗しました:', error);
    throw error;
  }
};

export const updateEvent = async (eventData: UpdateEventPayload): Promise<Event> => {
  try {
    const response = await client.put(`${EVENTS_URL}/${eventData.id}`, eventData);
    return response.data;
  } catch (error) {
    console.error(`イベント(ID: ${eventData.id})の更新に失敗しました:`, error);
    throw error;
  }
};

export const deleteEvent = async (id: number): Promise<void> => {
  try {
    await client.delete(`${EVENTS_URL}/${id}`);
  } catch (error) {
    console.error(`イベント(ID: ${id})の削除に失敗しました:`, error);
    throw error;
  }
}; 