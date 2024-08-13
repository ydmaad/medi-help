import { create } from "zustand";
import { MedicinesType, ValuesType } from "@/types/calendar";
import uuid from "react-uuid";
import { DATE_OFFSET } from "@/constant/constant";
import { Tables } from "@/types/supabase";
import { EventInput } from "@fullcalendar/core";

interface ValuesState {
  values: ValuesType;
  setValues: (data: ValuesType) => void;
}

const initialValues = {
  id: uuid(),
  user_id: "",
  medi_time: "morning",
  medicine_id: [],
  side_effect: "",
  start_date: new Date(new Date().getTime() + DATE_OFFSET)
    .toISOString()
    .split("T")[0],
};

export const useValuesStore = create<ValuesState>((set) => ({
  values: initialValues,

  setValues: (data) => {
    set(() => ({ values: data }));
  },
}));

type CalendarType = Tables<"calendar">;

interface CalendarState {
  calendar: CalendarType[];
  setCalendar: (data: CalendarType[]) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  calendar: [],

  setCalendar: (data) => {
    set(() => ({ calendar: data }));
  },
}));

interface EventsState {
  events: EventInput[];
  setEvents: (data: EventInput[]) => void;
}

export const useEventsStore = create<EventsState>((set) => ({
  events: [],

  setEvents: (data) => {
    set(() => ({ events: data }));
  },
}));

interface MedicinesState {
  medicines: MedicinesType[];
  setMedicines: (data: MedicinesType[]) => void;
}

export const useMedicinesStore = create<MedicinesState>((set) => ({
  medicines: [],

  setMedicines: (data) => {
    set(() => ({ medicines: data }));
  },
}));

interface EditState {
  edit: boolean;
  setEdit: (data: boolean) => void;
}

export const useEditStore = create<EditState>((set) => ({
  edit: false,

  setEdit: (data) => {
    set(() => ({ edit: data }));
  },
}));

interface MediNameState {
  medicines: string[];
  setMediNames: (newMediNames: string[]) => void;
}

export const useMediNameFilter = create<MediNameState>((set) => ({
  mediNames: [],
  setMediNames: (newMediNames: string[]) => {
    set(() => ({mediNames: newMediNames}));
  },
}));