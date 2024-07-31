"use client";
import React, { useState } from "react";

type MedicinesType = {
  name: string;
  isChecked: boolean;
};

interface Props {
  medicines: MedicinesType[];
  setMedicines: React.Dispatch<React.SetStateAction<MedicinesType[]>>;
  name: string;
  idx: number;
}
const MediCheck = ({ medicines, setMedicines, name, idx }: Props) => {
  const [checked, setChecked] = useState<boolean>();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    const updateMedicines = medicines.map((medi: MedicinesType) => {
      if (medi.name === name) {
        return { name, isChecked: event.target.checked };
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
      className={`w-full h-5/6 min-h-12 flex bg-${
        checked ? "brand-primary-50" : "brand-gray-50"
      } rounded-md`}
    >
      <div className="w-3/5 flex flex-col justify-center gap-1 ">
        <div className="h-full text-xs">아침</div>
        <div className="h-full text-sm truncate">{name}</div>
      </div>
      <div className="w-2/5 flex items-center justify-center ">
        <label
          htmlFor={`medicine ${idx}`}
          className={`w-[28px] min-w-[28px] h-[28px] min-h-[28px] p-1 flex items-center justify-center rounded-sm text-3xl text-${
            checked ? "white" : "gray-200"
          } bg-${checked ? "brand-primary-500" : "transparent"}`}
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
