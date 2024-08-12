"use client";

import React from "react";
import FilterComponent from "./FilterComponent";
import { MedicinesType } from "@/types/calendar";
import SemiTitle from "../atoms/SemiTitle";
import ViewNote from "../atoms/ViewNote";
import PillComponent from "./PillComponent";
import { useMedicinesStore, useValuesStore } from "@/store/calendar";

const ViewModalInner = () => {
  const { values } = useValuesStore();
  const { medicines } = useMedicinesStore();

  return (
    <>
      <div className="h-[36px] text-brand-gray-800 text-[16px] py-1">
        {values.start_date && values.start_date.split("-").join(`. `) + "."}
      </div>
      <FilterComponent />
      <div className="w-full h-32 min-h-32 grid grid-cols-2 gap-2 overflow-y-auto">
        {medicines
          .filter((medi: MedicinesType) => {
            return medi.time[values.medi_time] === true;
          })
          .map((medicine: MedicinesType, idx: number) => {
            return <PillComponent key={idx} medicine={medicine} />;
          })}
      </div>
      <SemiTitle>노트</SemiTitle>
      <ViewNote values={values} />
    </>
  );
};

export default ViewModalInner;
