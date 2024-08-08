"use client";
import { MedicinesType, ValueType } from "@/types/calendar";
import React, { useEffect, useState } from "react";
import { NAME_OF_TIME } from "@/constant/constant";

interface Props {
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
  medicine: MedicinesType;
  idx: number;
}
const MediCheck = ({ values, setValues, medicine, idx }: Props) => {
  const [checked, setChecked] = useState<boolean>();
  const [mediTimes, setMediTimes] = useState<string[]>([]);
  const { id, time, name } = medicine;

  useEffect(() => {
    let timeOfMedicine = Object.keys(time).filter((times) => {
      return time[times] === true;
    });

    setMediTimes(
      timeOfMedicine.map((time) => {
        return NAME_OF_TIME[time];
      })
    );
  }, [time]);

  useEffect(() => {
    setChecked(values.medicine_id.includes(id));
  }, [values.medicine_id.length]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setValues((prev) => {
        return { ...prev, medicine_id: [...values.medicine_id, id] };
      });
    } else {
      let deletedMediName = values.medicine_id.filter(
        (medi_id) => medi_id !== id
      );
      setValues((prev) => {
        return { ...prev, medicine_id: deletedMediName };
      });
    }
  };

  return (
    <div
      className={`w-full h-14 px-3 py-2 flex ${
        checked ? "bg-brand-primary-50" : "bg-brand-gray-50"
      } rounded-md`}
    >
      <div className="w-3/5 flex flex-col justify-center gap-1 ">
        <div className="h-full text-xs text-gray-600">
          {mediTimes.join(", ")}
        </div>
        <div className="h-full text-sm text-gray-1000 truncate">{name}</div>
      </div>
      <div className="w-2/5 flex items-center justify-center ">
        <label
          htmlFor={`medicine ${idx}`}
          className={`w-[28px] min-w-[28px] h-[28px] min-h-[28px] p-1 flex items-center justify-center rounded-sm text-3xl ${
            checked ? "text-white" : "text-gray-200"
          } ${checked ? "bg-brand-primary-500" : "bg-transparent"}`}
        >
          ✓
        </label>
        <input
          type="checkbox"
          id={`medicine ${idx}`}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default MediCheck;
