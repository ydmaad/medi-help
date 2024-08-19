import CalendarView from "@/components/templates/calendar/calendarView/CalendarView";
import CalendarCheckbox from "@/components/templates/calendar/calendarView/CalendarCheckbox";
import React from "react";
import CalendarTitle from "@/components/molecules/CalendarTitle";

const Page = () => {
  return (
    <>
      <div className="relative block desktop:flex w-full min-h-screen desktop:justify-center mt-4">
        <CalendarCheckbox />
        <CalendarView />
      </div>
    </>
  );
};

export default Page;
