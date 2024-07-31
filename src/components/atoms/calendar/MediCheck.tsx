"use client";
import { ValueType } from "@/types/calendar_values";
import React, { useEffect, useState } from "react";

interface Props {
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
  name: string;
  time: { [key: string]: boolean };
  idx: number;
}
const MediCheck = ({ values, setValues, name, time, idx }: Props) => {
  const [checked, setChecked] = useState<boolean>();
  const [mediTimes, setMediTimes] = useState<string[]>([]);

  const TimeName: { [key: string]: string } = {
    morning: "아침",
    afternoon: "점심",
    evening: "저녁",
  };

  useEffect(() => {
    console.log(Object.keys(time));
    let timeForMedicine = Object.keys(time).filter((times) => {
      return time[times] === true;
    });
    setMediTimes(
      timeForMedicine.map((time) => {
        return TimeName[time];
      })
    );
  }, []);

  useEffect(() => {
    console.log(values.medi_name.includes(name));
    setChecked(values.medi_name.includes(name));
  }, [values.medi_name.length]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setValues((prev) => {
        return { ...prev, medi_name: [...values.medi_name, name] };
      });
    } else {
      let deletedMediName = values.medi_name.filter((medi) => medi !== name);
      setValues((prev) => {
        return { ...prev, medi_name: deletedMediName };
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
