import { EventInput } from "@fullcalendar/core";

export type ValueType = {
  id: string;
  user_id: string;
  medi_time: string;
  side_effect: string;
  start_date: Date;
  medicine_id: string[];
};

export type MedicinesType = {
  id: string;
  name: string;
  time: { [key: string]: boolean };
};

export interface EventsType extends Omit<EventInput, "groupId"> {
  groupId?: string | null;
  title: string;
  start: Date | null;
  backgroundColor: string;
  borderColor: string;
  extendProps: { sideEffect: string };
}
