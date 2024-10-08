"use client";

import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface SortOptionProps {
  sortOption: string;
  setSortOption: (option: string) => void;
  setCurrentPage: (page: number) => void;
}

const SortOption = ({
  sortOption,
  setSortOption,
  setCurrentPage,
}: SortOptionProps) => {
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const optionList = ["최신순", "오래된순", "인기순"];

  // 정렬 리스트 펼기치 핸들러
  const handleOptionOpen = () => {
    setIsOptionOpen(!isOptionOpen);
  };

  // 정렬 리스트에서 옵션 선택 핸들러
  const handleOptionSelect = (option: string) => {
    setSortOption(option);
    setCurrentPage(1); // 정렬 옵션이 변경되면 첫 페이지로 도라감
  };

  return (
    <>
      <div className="relative desktop:mr-0">
        <button
          onClick={handleOptionOpen}
          className="flex items-center justify-center text-brand-gray-600 whitespace-nowrap"
        >
          <span className="mx-2 mt-2 text-[10px] desktop:text-sm">
            {sortOption}
          </span>
          <IoIosArrowDown className="flex-shrink-0" />
        </button>
        {isOptionOpen && (
          <div className="absolute -left-[10px] desktop:-left-[20px] text-[12px] desktop:text-[14px] mt-2 flex h-[100px] desktop:h-[110px] w-[77px] desktop:w-[106px] flex-col items-center justify-center gap-[0.3rem] border shadow rounded-lg bg-white z-10">
            {optionList.map((option, index) => (
              <button
                key={option}
                onClick={() => {
                  handleOptionSelect(option);
                  handleOptionOpen(); // 옵션 선택 후 리스트를 닫습니다.
                }}
                className="text-brand-gray-800 text-sx desktop:text-sm w-full  hover:bg-gray-100"
              >
                {option}
                {index !== optionList.length - 1 && (
                  <hr className="mt-[5px] mx-auto w-[48px] desktop:w-[80px]  border-brand-gray-200" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SortOption;
