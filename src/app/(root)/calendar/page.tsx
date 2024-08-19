import CalendarCheckbox from "@/components/templates/calendar/calendarView/CalendarCheckbox";
import React from "react";
import CalendarView from "@/components/templates/calendar/calendarView/CalendarView";

const Page = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative flex  w-full max-w-[1000px] mt-4">
        <CalendarCheckbox />
        <CalendarView />
      </div>
    </div>
  );
};

export default Page;
