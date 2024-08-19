import CalendarView from "@/components/templates/calendar/calendarView/CalendarView";
import CalendarCheckbox from "@/components/templates/calendar/calendarView/CalendarCheckbox";
import React from "react";
import CalendarTitle from "@/components/molecules/CalendarTitle";

const Page = () => {
  return (
    <>
      <div className="flex w-full min-h-screen justify-center px-4 mt-4">
        <div>
          <CalendarTitle />
          <CalendarCheckbox />
        </div>

        <CalendarView />
      </div>
    </>
  );
};

export default Page;
