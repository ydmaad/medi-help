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
      className={`${
        values.medi_time === time
          ? "rounded-full bg-[#9CD2FC] w-8 h-8 text-[12px] text-[#155189]"
          : "rounded-full bg-brand-gray-50 w-8 h-8 text-[12px] text-brand-gray-400"
      } `}
    >
      {children}
    </button>
  );
};

export default ModalFilterButton;
