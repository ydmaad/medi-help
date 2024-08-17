import React from "react";
import { useBarText } from "../../hooks/useBarText";

const BarText = () => {
  const { leftText, rightText } = useBarText();

  return (
    <div className="flex items-center text-[10px] desktop:text-sm mt-[2px] ">
      <span className="line-clamp-1">{leftText}</span>
      <span className="mx-2 ">|</span>
      <span className="overflow-hidden text-ellipsis line-clamp-1">
        {rightText}
      </span>
    </div>
  );
};

export default BarText;
