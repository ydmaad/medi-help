import React from "react";
import ModalFilterButton from "../atoms/ModalFilterButton";
import { useValuesStore } from "@/store/calendar";

const FilterComponent = () => {
  const { values, setValues } = useValuesStore();
  // time Category onClick 함수
  const handleTimeClick = (time: string) => {
    setValues({ ...values, medi_time: time, medicine_id: [] });
  };

  return (
    <>
      <div className="flex align-items gap-[12px] text-xs text-gray-400">
        <ModalFilterButton handleTimeClick={handleTimeClick} time={"morning"}>
          아침
        </ModalFilterButton>
        <ModalFilterButton handleTimeClick={handleTimeClick} time={"afternoon"}>
          점심
        </ModalFilterButton>
        <ModalFilterButton handleTimeClick={handleTimeClick} time={"evening"}>
          저녁
        </ModalFilterButton>
      </div>
    </>
  );
};

export default FilterComponent;
