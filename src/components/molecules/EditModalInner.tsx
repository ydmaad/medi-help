"use client";

import { MedicinesType, ValuesType } from "@/types/calendar";
import React from "react";
import MediCheck from "../atoms/MediCheck";
import SemiTitle from "../atoms/SemiTitle";
import FilterComponent from "./FilterComponent";
import EditNote from "../atoms/EditNote";
import {
  useCalendarStore,
  useMedicinesStore,
  useValuesStore,
} from "@/store/calendar";

const EditModalInner = () => {
  const { values, setValues } = useValuesStore();
  const { medicines } = useMedicinesStore();
  const { calendar } = useCalendarStore();

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let filteredCalendar = calendar.filter(
      (cal) => cal.start_date === event.target.value
    );
    setValues({
      ...values,
      start_date: event.target.value,
      side_effect: filteredCalendar.length
        ? filteredCalendar[0].side_effect
        : "",
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
        className="px-24 py-1 text-md text-brand-gray-800 border border-brand-gray-200 outline-none rounded-sm"
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
