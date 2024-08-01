export type ValueType = {
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
  textColor: string;
};
