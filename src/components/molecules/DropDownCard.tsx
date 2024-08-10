import React, { useState } from "react";

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

  const handleButtonClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`my-[24px] rounded-[16px] border-[1px] border-brand-gray-50 transition-all duration-300 ${
        isFlipped ? "h-auto" : "h-[76px]"
      }`}
    >
      <div className="mx-[40px] flex items-center justify-between p-4">
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
      {isFlipped && (
        <div className="p-4 text-left mx-[40px]">
          {hiddenText &&
            hiddenText.map((text) => <div className="mb-2">{text}</div>)}
        </div>
      )}
    </div>
  );
};

export default DropDownCard;
