import { useValuesStore } from "@/store/calendar";
import { ValuesType } from "@/types/calendar";
import React from "react";

interface Props {
  values: ValuesType;
}

const ViewNote = ({ values }: Props) => {
  return (
    <div
      className={`h-[125px] p-4 mt-[8px] w-full border border-brand-gray-50 bg-brand-gray-50 font-normal ${
        values.side_effect && values.side_effect.length !== 0
          ? "text-[16px] text-brand-gray-800"
          : "text-[14px] text-brand-gray-600"
      }  `}
    >
      {values.side_effect && values.side_effect.length !== 0
        ? values.side_effect
        : "복약 후 몸 상태나 오늘 하루 복약에 대한 한 마디"}
    </div>
  );
};

export default ViewNote;
