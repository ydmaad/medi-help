"use client";
import React, { useEffect, useState } from "react";

type MedicinesType = {
  name: string;
  isChecked: boolean;
  time: { [key: string]: boolean };
};

interface Props {
  medicines: MedicinesType[];
  setMedicines: React.Dispatch<React.SetStateAction<MedicinesType[]>>;
  name: string;
  time: { [key: string]: boolean };
  idx: number;
}
const MediCheck = ({ medicines, setMedicines, name, time, idx }: Props) => {
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    const updateMedicines = medicines.map((medi: MedicinesType) => {
      if (medi.name === name) {
        return { ...medi, isChecked: event.target.checked };
      }
      return medi;
    });
    if (updateMedicines.length !== 0) {
      setMedicines(updateMedicines as []);
    }

    console.log(medicines);
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
