import { useValuesStore } from "@/store/calendar";
import { ValuesType } from "@/types/calendar";
import React from "react";

interface Props {
  values: ValuesType;
  setValues: (data: ValuesType) => void;
  handleContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EditNote = ({ values, setValues, handleContentChange }: Props) => {
  return (
    <textarea
      name="side_effect"
      value={values.side_effect ? values.side_effect : ""}
      onChange={handleContentChange}
      placeholder="복약 후 몸 상태나 오늘 하루 복약에 대한 한 마디"
      className="h-2/5 min-h-28 p-4 border border-brand-gray-200 outline-none rounded-sm text-sm resize-none"
    ></textarea>
  );
};

export default EditNote;
