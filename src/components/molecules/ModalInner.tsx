"use client";

import { MedicinesType, ValueType } from "@/types/calendar";
import React, { useEffect, useState } from "react";
import MediCheck from "../atoms/MediCheck";
import SemiTitle from "../atoms/SemiTitle";
import { handleContentChange } from "@/utils/calendar/calendarFunc";
import FilterComponent from "./FilterComponent";
import CalendarEditNote from "../atoms/EditNote";

interface Props {
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
  medicines: MedicinesType[];
  setMedicines: React.Dispatch<React.SetStateAction<MedicinesType[]>>;
}

const EditModalInner = ({
  values,
  setValues,
  medicines,
  setMedicines,
}: Props) => {
  return (
    <>
      <input
        type="date"
        name="start_date"
        value={values.start_date}
        onChange={(event) => handleContentChange(event, setValues)}
        className="px-24 py-1 text-md text-brand-gray-800 border border-brand-gray-200 outline-none rounded-sm"
      />
      <FilterComponent values={values} setValues={setValues} />
      <div className="w-full h-32 min-h-32 grid grid-cols-2 gap-2 overflow-y-auto">
        {medicines
          .filter((medi: MedicinesType) => {
            return medi.time[values.medi_time] === true;
          })
          .map((medicine: MedicinesType, idx: number) => {
            return (
              <MediCheck
                values={values}
                setValues={setValues}
                medicine={medicine}
                idx={idx}
                key={idx}
              />
            );
          })}
      </div>
      <SemiTitle>노트</SemiTitle>
      <CalendarEditNote values={values} setValues={setValues} />
    </>
  );
};

export default EditModalInner;
