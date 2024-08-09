import { ValueType } from "@/types/calendar";
import React from "react";
import ModalFilterButton from "../atoms/ModalFilterButton";

interface Props {
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
}

const FilterComponent = ({ values, setValues }: Props) => {
  // time Category onClick 함수
  const handleTimeClick = (time: string) => {
    setValues((prev) => {
      return { ...prev, medicine_id: [], medi_time: time };
    });
  };

  return (
    <>
      <div className="flex align-items gap-[12px] text-xs text-gray-400">
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
    </>
  );
};

export default FilterComponent;
