export type ValuesType = {
  id: string;
  user_id: string;
  medi_time: string;
  side_effect: string | null;
  start_date: string;
  medicine_id: string[];
};

export type MedicinesType = {
  id: string;
  name: string;
  nickname: string;
  time: { [key: string]: boolean };
  notes: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  userId: string;
  dayOfWeek: string[];
  repeat: boolean;
  notification_time: string[];
};
