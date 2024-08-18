import CalendarView from "@/components/templates/calendar/calendarView/CalendarView";
import CalendarCheckbox from "@/components/templates/calendar/calendarView/CalendarCheckbox";
import React from "react";

const Page = () => {
  return (
    <div className="flex w-full min-h-screen justify-center px-4 mt-4">
      <div className="hidden desktop:block min-w-[240px] min-h-screen p-4 mt-[20px]">
        <CalendarCheckbox />
      </div>
      <CalendarView />
    </div>
  );
};

export default Page;
