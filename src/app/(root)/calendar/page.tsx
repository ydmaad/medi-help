import CalendarCheckbox from "@/components/templates/calendar/calendarView/CalendarCheckbox";
import React from "react";
import CalendarView from "@/components/templates/calendar/calendarView/CalendarView";

const Page = () => {
  return (
    <>
      <div className="flex desktop:hidden items-center justify-center h-screen">
        <div className="relative flex flex-col w-full mt-[36px] max-w-[335px] mx-auto">
          <CalendarCheckbox />
          <CalendarView />
        </div>
      </div>
      <div className="hidden desktop:flex items-center justify-center h-screen">
        <div className="relative flex w-full max-w-[1000px] mx-auto mt-4">
          <CalendarCheckbox />
          <CalendarView />
        </div>
      </div>
    </>
  );
};

export default Page;
