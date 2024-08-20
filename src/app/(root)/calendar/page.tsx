import React from "react";
import CalendarTemplate from "@/components/templates/calendar/CalendarTemplate";

const Page = () => {
  return (
    <>
      <div className="flex desktop:hidden items-center justify-start h-full pt-[77px]">
        <div className="relative flex flex-col w-full max-w-[335px] mx-auto">
          <CalendarTemplate />
        </div>
      </div>
      <div className="hidden desktop:flex items-center justify-center h-screen">
        <div className="relative flex w-full max-w-[1000px] mx-auto">
          <CalendarTemplate />
        </div>
      </div>
    </>
  );
};

export default Page;
