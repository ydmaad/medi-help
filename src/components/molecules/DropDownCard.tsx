import React, { useState, useRef } from "react";

interface DropDownCardProps {
  title: string;
  hiddenText?: string[];
}

const DropDownCard = ({ title, hiddenText }: DropDownCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="mt-[8px] w-[335px] desktop:mt-[16px] desktop:w-[996px] border rounded-[16px] bg-white border-brand-gray-50 overflow-hidden">
        <div className="mx-[40px] flex items-center justify-between p-4 ">
          <div
            className={`text-[16px] desktop:text-[20px] font-semibold ${
              isFlipped ? "text-brand-primary-500" : "text-brand-gray-800"
            }`}
          >
            {title}
          </div>
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
                stroke={isFlipped ? "#279ef9" : "#7c7f86"}
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
        <div
          ref={contentRef}
          className={`transition-max-height duration-300 ease-in-out text-left ${
            isFlipped ? "max-h-[200px] p-3 mx-[40px]" : "max-h-0 p-0 mx-[40px]"
          }`}
        >
          {hiddenText &&
            hiddenText.map((text, index) => (
              <div key={index} className="mb-2 ">
                {text}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DropDownCard;
