import React from "react";
import FilterComponent from "./FilterComponent";
import { MedicinesType, ValueType } from "@/types/calendar";
import MediCheck from "../atoms/MediCheck";
import SemiTitle from "../atoms/SemiTitle";
import CalendarEditNote from "../atoms/EditNote";
import PillComponent from "./PillComponent";
import { EventInput } from "@fullcalendar/core";
import ViewNote from "../atoms/ViewNote";

interface Props {
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
  medicines: MedicinesType[];
  setMedicines: React.Dispatch<React.SetStateAction<MedicinesType[]>>;
  events: EventInput[];
}

const ViewModalInner = ({
  values,
  setValues,
  medicines,
  setMedicines,
  events,
}: Props) => {
  return (
    <>
      <div className="h-[36px] text-brand-gray-800 text-[16px] py-1">
        {values.start_date.split("-").join(`. `) + "."}
      </div>
      <FilterComponent values={values} setValues={setValues} />
      <div className="w-full h-32 min-h-32 grid grid-cols-2 gap-2 overflow-y-auto">
        {medicines
          .filter((medi: MedicinesType) => {
            return medi.time[values.medi_time] === true;
          })
          .map((medicine: MedicinesType, idx: number) => {
            return (
              <PillComponent
                key={idx}
                medicine={medicine}
                events={events}
                values={values}
                setValues={setValues}
              />
            );
          })}
      </div>
      <SemiTitle>노트</SemiTitle>
      <ViewNote values={values} />
    </>
  );
};

export default ViewModalInner;
