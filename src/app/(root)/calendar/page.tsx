import CalendarView from "@/components/templates/calendar/calendarView/CalendarView";
import MediRecords from "@/components/templates/calendar/calendarView/MediRecords";
import React from "react";

const Page = () => {
  return (
    <div className="flex w-full min-h-screen">
      <div className="max-[414px]:hidden min-w-[240px] min-h-screen p-4 bg-gray-100 overflow-y-auto">
        <MediRecords />
      </div>
      <div>
        <CalendarView />
      </div>
    </div>
  );
};

export default Page;
