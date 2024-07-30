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
        selected ? "text-brand-primary-600" : "text-brand-gray-400"
      }`}
    >
      {number}
    </button>
  );
};

export default PageNumber;
