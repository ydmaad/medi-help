import { ValueType } from "@/types/calendar";
import React from "react";
interface Props {
  values: ValueType;
  handleTimeClick: (time: string) => void;
  time: string;
  children: string;
}

const ModalFilterButton = ({
  values,
  handleTimeClick,
  time,
  children,
}: Props) => {
  return (
    <button
      onClick={() => handleTimeClick(time)}
      className={`w-[34px] h-[34px] flex justify-center items-center rounded-full ${
        values.medi_time === time ? "bg-brand-primary-200" : "bg-transparent"
      } ${
        values.medi_time === time
          ? "text-brand-primary-800"
          : "text-brand-gray-400"
      } `}
    >
      {children}
    </button>
  );
};

export default ModalFilterButton;
