import { EventInput } from "@fullcalendar/core";

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

export interface EventsType extends Omit<EventInput, "groupId"> {
  groupId?: string | null;
  title: string;
  start: string | Date;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}
