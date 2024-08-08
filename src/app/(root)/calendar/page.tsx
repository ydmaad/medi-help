"use client";

import CalendarView from "@/components/templates/calendar/calendarView/CalendarView";
import MediRecords from "@/components/templates/calendar/calendarView/MediRecords";
import React from "react";

const Page = () => {
  return (
    <div className="flex min-h-screen">
      {/* <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
        <MediRecords />
      </div> */}
      <div className="w-3/4">
        <CalendarView />
      </div>
    </div>
  );
};

export default Page;
