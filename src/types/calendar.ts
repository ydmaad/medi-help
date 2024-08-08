export type ValueType = {
  id: string;
  user_id: string;
  medi_time: string;
  side_effect: string;
  start_date: string;
  medicine_id: string[];
};

export type MedicinesType = {
  id: string;
  name: string;
  time: { [key: string]: boolean };
};
