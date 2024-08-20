"use client";

import { MedicinesType, ValuesType } from "@/types/calendar";
import React from "react";
import MediCheck from "../atoms/MediCheck";
import SemiTitle from "../atoms/SemiTitle";
import FilterComponent from "./FilterComponent";
import EditNote from "../atoms/EditNote";
import {
  useCalendarStore,
  useEditStore,
  useEventsStore,
  useMedicinesStore,
  useMediNameFilter,
  useValuesStore,
} from "@/store/calendar";
import { EventInput } from "@fullcalendar/core";

interface Props {
  viewEvents: boolean;
  setViewEvents: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModalInner = ({ viewEvents, setViewEvents }: Props) => {
  const { values, setValues } = useValuesStore();
  const { medicines } = useMedicinesStore();
  const { calendar } = useCalendarStore();
  const { events, setEvents } = useEventsStore();
  const { edit, setEdit } = useEditStore();

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let filteredCalendar = calendar.filter(
      (cal) => cal.start_date === event.target.value
    );

    let editList = events.filter((data) => {
      return data.start?.toString().split(" ")[0] === event.target.value;
    });

    let viewEvent = editList.filter((data: EventInput) => {
      return data.extendProps.medi_time === "morning";
    })[0];

    if (filteredCalendar.length || editList.length) {
      setViewEvents(true);
    } else {
      setViewEvents(false);
    }

    setEdit(false);

    setValues({
      ...values,
      start_date: event.target.value,
      medi_time: "morning",
      side_effect: filteredCalendar.length
        ? filteredCalendar[0].side_effect
        : "",
      medicine_id: viewEvent ? viewEvent.extendProps.medicineList : [],
    });
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <>
      <input
        type="date"
        value={values.start_date}
        onChange={handleDateChange}
        className="w-full desktop:w-auto bg-[#fff] mx-auto px-[90px] py-3 desktop:px-24 desktop:py-1 text-md text-brand-gray-800 border border-brand-gray-200 outline-none rounded-sm"
      />
      <FilterComponent />
      <div className="w-full h-32 min-h-32 grid grid-cols-2 gap-2 overflow-y-auto">
        {medicines
          .filter((medi: MedicinesType) => {
            return medi.time[values.medi_time] === true;
          })
          .map((medicine: MedicinesType, idx: number) => {
            return <MediCheck medicine={medicine} idx={idx} key={idx} />;
          })}
      </div>
      <SemiTitle>노트</SemiTitle>
      <EditNote
        values={values}
        setValues={setValues}
        handleContentChange={handleContentChange}
      />
    </>
  );
};

export default EditModalInner;
