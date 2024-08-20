import React from "react";

interface Props {
  showFilterBox: boolean;
  setShowFilterBox: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalendarTitle = ({ showFilterBox, setShowFilterBox }: Props) => {
  return (
    <>
      <div className="mx-auto desktop:static flex items-center justify-between min-w-[335px] h-[68px] desktop:w-[172px] desktop:min-w-[172px] desktop:h-auto gap-[6px] px-2">
        <div className="flex items-center">
          <img
            src="/pencil.png"
            alt="연필 아이콘"
            className="w-[18px] desktop:w-[28px] h-auto mr-2"
          />
          <h1 className="w-[117px] h-[43px] flex items-center text-[20px] desktop:text-[30px] text-brand-gray-1000 font-bold">
            복약 달력
          </h1>
        </div>
        <button
          className="block desktop:hidden"
          onClick={() => setShowFilterBox(true)}
        >
          <img
            src="/filter-button.svg"
            alt="필터 버튼"
            className="w-[22px] h-[22px]"
          />
        </button>
      </div>
    </>
  );
};

export default CalendarTitle;
