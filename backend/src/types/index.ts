export interface Event {
    id?: number;
    title: string;
    description: string | null;
    start_date: Date;
    end_date: Date;
    is_holiday: boolean;
    is_recurring: boolean;
    recurrence_pattern: string | null;
    created_by: number;
    created_at?: Date;
    updated_at?: Date;
  }

  export interface User {
    id?: number;
    username: string;
    password_hash: string;
    is_admin: boolean;
    created_at?: Date;
    updated_at?: Date;
  }

  export interface AccessSetting {
    id?: number;
    require_auth: boolean;
    access_password_hash: string | null;
    updated_at?: Date;
  }