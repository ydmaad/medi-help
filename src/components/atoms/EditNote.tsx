import { ValueType } from "@/types/calendar";
import { handleContentChange } from "@/utils/calendar/calendarFunc";
import React from "react";

interface Props {
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
}

const EditNote = ({ values, setValues }: Props) => {
  return (
    <textarea
      name="side_effect"
      value={values.side_effect}
      onChange={(event) => handleContentChange(event, setValues)}
      placeholder="간단한 약 메모"
      className="h-2/5 min-h-28 p-1 border border-brand-gray-200 outline-none rounded-sm text-sm resize-none"
    ></textarea>
  );
};

export default EditNote;
