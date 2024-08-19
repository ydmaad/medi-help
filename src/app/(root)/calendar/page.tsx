import CalendarCheckbox from "@/components/templates/calendar/calendarView/CalendarCheckbox";
import React from "react";
import CalendarView from "@/components/templates/calendar/calendarView/CalendarView";

const Page = () => {
  return (
    <>
      <div className="relative block desktop:flex w-full desktop:justify-center mt-4">
        <CalendarCheckbox />
        <CalendarView />
      </div>
    </>
  );
};

export default Page;
