import React from "react";

const CalendarTitle = () => {
  return (
    <>
      <div className="flex items-center w-[172px] mt-[72px] gap-[6px]">
        <img
          src="/pencil.png"
          alt="연필 아이콘"
          className="w-[28px] h-auto mr-2"
        />
        <h1 className="w-[117px] h-[43px] text-[30px] text-brand-gray-1000 font-extrabold">
          복약 달력
        </h1>
      </div>
    </>
  );
};

export default CalendarTitle;
