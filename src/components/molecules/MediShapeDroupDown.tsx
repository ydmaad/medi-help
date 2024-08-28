import React, { useState, useRef } from "react";
import SelectionComponent from "./MediShapeSearch";

interface MediShapeDropDownProps {
  title: string;
}

const MediShapeDropDown = ({ title }: MediShapeDropDownProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mt-[12px] w-[795px] rounded-[16px] bg-white overflow-hidden">
        <div className="flex items-center justify-between h-[40px] mx-[14px]">
          <div className={`text-[14px] text-brand-gray-1000`}>{title}</div>
          <button
            className={`flex items-center justify-center w-10 h-10 transition-transform duration-300 ${
              isFlipped ? "rotate-180" : "bg-transparent"
            }`}
            onClick={handleButtonClick}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 9L12 15L6 9"
                stroke="#40444c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-300 ${
                  isFlipped ? "rotate-360" : "rotate-0"
                }`}
                style={{ transformOrigin: "center" }}
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={contentRef}
        className={`transition-max-height duration-300 ease-in-out text-left ${
          isFlipped ? "max-h-[500px] " : "max-h-0 p-0"
        }`}
      >
        {isFlipped && (
          <div className="mt-3">
            <SelectionComponent />
          </div>
        )}
      </div>
    </div>
  );
};

export default MediShapeDropDown;
