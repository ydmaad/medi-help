"use client";

import { MedicinesType, ValuesType } from "@/types/calendar";
import React from "react";
import MediCheck from "../atoms/MediCheck";
import SemiTitle from "../atoms/SemiTitle";
import { handleContentChange } from "@/utils/calendar/calendarFunc";
import FilterComponent from "./FilterComponent";
import CalendarEditNote from "../atoms/EditNote";
import { useMedicinesStore, useValuesStore } from "@/store/calendar";

const EditModalInner = () => {
  const { values, setValues } = useValuesStore();
  const { medicines } = useMedicinesStore();

  return (
    <>
      <input
        type="date"
        name="start_date"
        value={values.start_date}
        onChange={(event) => handleContentChange(event, values, setValues)}
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
      <CalendarEditNote />
    </>
  );
};

export default EditModalInner;
