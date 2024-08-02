export type ValueType = {
  user_id: string;
  medi_time: string;
  medi_name: string[];
  side_effect: string;
  start_date: Date;
};

export type MedicinesType = {
  name: string;
  time: { [key: string]: boolean };
};

export type EventsType = {
  groupId: string | null;
  title: string;
  start: Date | null;
  backgroundColor: string;
  borderColor: string;
  extendProps: { sideEffect: string };
};
