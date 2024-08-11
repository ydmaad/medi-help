"use client";
import { useAuthStore } from "@/store/auth";
import { MedicinesType, ValueType } from "@/types/calendar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ModalFilterButton from "../atoms/ModalFilterButton";
import MediCheck from "../atoms/MediCheck";
import SemiTitle from "../atoms/SemiTitle";
import { handleContentChange } from "@/utils/calendar/calendarFunc";

interface Props {
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
  medicines: MedicinesType[];
  setMedicines: React.Dispatch<React.SetStateAction<MedicinesType[]>>;
}

const ModalInner = ({ values, setValues, medicines, setMedicines }: Props) => {
  // time Category onClick 함수
  const handleTimeClick = (time: string) => {
    setValues((prev) => {
      return { ...prev, medicine_id: [], medi_time: time };
    });
  };

  return (
    <>
      <div className="flex align-items gap-2 text-xs text-gray-400">
        <ModalFilterButton
          values={values}
          handleTimeClick={handleTimeClick}
          time={"morning"}
        >
          아침
        </ModalFilterButton>
        <ModalFilterButton
          values={values}
          handleTimeClick={handleTimeClick}
          time={"afternoon"}
        >
          점심
        </ModalFilterButton>
        <ModalFilterButton
          values={values}
          handleTimeClick={handleTimeClick}
          time={"evening"}
        >
          저녁
        </ModalFilterButton>
      </div>
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
      <textarea
        name="side_effect"
        value={values.side_effect}
        onChange={(event) => handleContentChange(event, setValues)}
        placeholder="간단한 약 메모"
        className="h-2/5 min-h-20 p-1 border border-brand-gray-200 outline-none rounded-sm text-sm resize-none"
      ></textarea>
    </>
  );
};

export default ModalInner;
