import React, { useState, useRef } from "react";

interface DropDownCardProps {
  title: string;
  buttonImage: string;
  hiddenText?: string[];
}

const DropDownCard = ({
  title,
  buttonImage,
  hiddenText,
}: DropDownCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="mt-[16px] rounded-[16px] border w-[996px] bg-white border-brand-gray-50 overflow-hidden">
        <div className="mx-[40px] flex items-center justify-between p-4 ">
          <div
            className={`text-lg font-semibold ${
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
            <img
              src={buttonImage}
              alt="버튼 이미지"
              className={`object-cover w-full h-full transition-transform duration-300 ${
                isFlipped ? "transform rotate-180" : "rotate-180"
              }`}
            />
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
