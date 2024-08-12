"use client";
import { MedicinesType } from "@/types/calendar";
import React, { useEffect, useState } from "react";
import { NAME_OF_TIME } from "@/constant/constant";
import { useValuesStore } from "@/store/calendar";

interface Props {
  medicine: MedicinesType;
  idx: number;
}
const MediCheck = ({ medicine, idx }: Props) => {
  const [checked, setChecked] = useState<boolean>();
  const [mediTimes, setMediTimes] = useState<string[]>([]);
  const { id, time, name } = medicine;

  const { values, setValues } = useValuesStore();

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
      setValues({ ...values, medicine_id: [...values.medicine_id, id] });
    } else {
      let deletedMediName = values.medicine_id.filter(
        (medi_id) => medi_id !== id
      );
      setValues({ ...values, medicine_id: deletedMediName });
    }
  };

  return (
    <div
      className={`w-full h-14 px-4 py-2 flex justify-between ${
        checked ? "bg-brand-primary-50" : "bg-brand-gray-50"
      } rounded-[4px]`}
    >
      <div className=" flex flex-col justify-center gap-0.5 font-normal ">
        <div
          className={`text-[12px] ${
            checked ? "text-[#7C7F86]" : "text-[#7C7F86]"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              checked ? "bg-[#BCE1FD]" : "bg-[#E0E2E4]"
            } inline-block mr-1`}
          />
          {NAME_OF_TIME[values.medi_time]}
          <span
            className={checked ? "text-[#279EF9] ml-1" : "text-[#7C7F86] ml-1"}
          >
            {`오후 12:00`}
          </span>
        </div>
        <div
          className={`h-full text-sm truncate ${
            checked ? "text-brand-gray-1000" : "text-brand-gray-600"
          }`}
        >
          {name}
        </div>
      </div>
      <div className="flex items-center justify-center ">
        <label
          htmlFor={`medicine ${idx}`}
          className={`w-[28px] min-w-[28px] h-[28px] min-h-[28px] p-1 flex items-center justify-center rounded-sm text-3xl ${
            checked ? "text-brand-primary-500" : "text-gray-200"
          } bg-transparent`}
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
