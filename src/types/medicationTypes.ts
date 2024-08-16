// src/types/medicationTypes.ts

export interface MediRecord {
    id: string;
    medi_name: string;
    medi_nickname: string;
    times: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
    notes: string;
    start_date: string;
    end_date: string;
    created_at: string;
    user_id: string;
    itemImage?: string | null;
    notification_time?: string[];
    day_of_week?: string[];
    repeat?: boolean;
    is_sent?: false;
  }
  