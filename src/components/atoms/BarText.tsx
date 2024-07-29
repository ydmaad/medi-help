import React from "react";
import { useBarText } from "../../hooks/useBarText";

const BarText = () => {
  const { leftText, rightText } = useBarText();

  return (
    <div className="flex items-center text-gray-500 text-sm mt-4">
      <span>{leftText}</span>
      <span className="mx-2">|</span>
      <span>{rightText}</span>
    </div>
  );
};

export default BarText;
