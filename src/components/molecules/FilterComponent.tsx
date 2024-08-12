"use client";

import React from "react";
import ModalFilterButton from "../atoms/ModalFilterButton";
import {
  useCalendarStore,
  useEventsStore,
  useValuesStore,
} from "@/store/calendar";
import { EventInput } from "@fullcalendar/core";

const FilterComponent = () => {
  const { events, setEvents } = useEventsStore();
  const { values, setValues } = useValuesStore();

  const handleTimeClick = (time: string) => {
    let editList = events.filter((event) => {
      return (
        values.start_date &&
        event.start?.toString().split(" ")[0] === values.start_date
      );
    });

    let viewEvent = editList.filter((event: EventInput) => {
      return event.extendProps.medi_time === time;
    })[0];
    setValues({
      ...values,
      medi_time: time,
      medicine_id: viewEvent ? viewEvent.extendProps.medicineList : [],
    });
  };

  return (
    <>
      <div className="flex align-items gap-[12px] text-xs text-gray-400">
        <ModalFilterButton handleTimeClick={handleTimeClick} time={"morning"}>
          아침
        </ModalFilterButton>
        <ModalFilterButton handleTimeClick={handleTimeClick} time={"afternoon"}>
          점심
        </ModalFilterButton>
        <ModalFilterButton handleTimeClick={handleTimeClick} time={"evening"}>
          저녁
        </ModalFilterButton>
      </div>
    </>
  );
};

export default FilterComponent;
