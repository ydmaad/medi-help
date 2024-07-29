import React from "react";

interface PageNumberProps {
  number: number;
  onClick: (page: number) => void;
  selected: boolean;
}

const PageNumber = ({ number, onClick, selected }: PageNumberProps) => {
  return (
    <button
      onClick={() => onClick(number)}
      className={`page-number ${
        selected ? "text-[#2390e3]" : "text-[#bcbfc1]"
      }`}
    >
      {number}
    </button>
  );
};

export default PageNumber;
