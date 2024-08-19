import React, { useState, useEffect } from "react";
import { useBarText } from "../../hooks/useBarText";

const BarText = () => {
  const { leftText, rightText } = useBarText();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (leftText || rightText) {
      setIsLoading(false);
    }
  }, [leftText, rightText]);

  return (
    <div className="flex items-center text-[10px]  desktop:text-sm mt-[2px]">
      {isLoading ? (
        <>
          <div className="h-[12px] bg-gray-200 animate-pulse w-1/3 mb-1"></div>
          <span className="mx-2">|</span>
          <div className="h-[12px] bg-gray-200 animate-pulse w-1/3 mb-1"></div>
        </>
      ) : (
        <>
          <span className="line-clamp-1">{leftText}</span>
          <span className="mx-2">|</span>
          <span className="overflow-hidden text-ellipsis line-clamp-1">
            {rightText}
          </span>
        </>
      )}
    </div>
  );
};

export default BarText;
