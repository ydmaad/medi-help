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
}
const MediCheck = ({ medicines, setMedicines, name }: Props) => {
  const [checked, setChecked] = useState<boolean>();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    const updateMedicines = medicines.map((medi: MedicinesType) => {
      if (medi.name === name) {
        return { name, isChecked: checked };
      }
    });

    if (updateMedicines.length !== 0) {
      setMedicines(updateMedicines as []);
    }

    console.log(medicines);
  };

  return (
    <div
      className={`w-full h-5/6 flex bg-${
        checked ? "sky-100" : "gray-100"
      } rounded-md`}
    >
      <div className="w-3/5 p-4 flex flex-col justify-center gap-1 ">
        <div className="text-xs">아침</div>
        <div className="text-sm">{name}</div>
      </div>
      <div className="w-2/5 flex items-center justify-center ">
        <label
          htmlFor="medicine"
          className={`w-[28px] min-w-[28px] h-[28px] min-h-[28px] p-1 flex items-center justify-center rounded-sm text-3xl text-${
            checked ? "white" : "gray-200"
          } bg-${checked ? "blue-400" : "transparent"}`}
        >
          ✓
        </label>
        <input
          type="checkbox"
          id="medicine"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default MediCheck;
