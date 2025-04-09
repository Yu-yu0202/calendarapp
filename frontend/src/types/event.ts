export interface Event {
  id: number;
  title: string;
  description?: string;
  start: string;
  end: string;
  color?: string;
  userId?: number;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  start: string;
  end: string;
  color?: string;
}

export interface UpdateEventPayload extends CreateEventPayload {
  id: number;
} 