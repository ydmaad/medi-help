import CalendarView from "@/components/templates/calendar/calendarView/CalendarView";
import CalendarCheckbox from "@/components/templates/calendar/calendarView/CalendarCheckbox";
import React from "react";

const Page = () => {
  return (
    <div className="flex justify-center w-full min-h-screen px-4"> {/* 전체를 감싸는 div */}
  <div className="flex w-full min-h-screen">
  <div className="max-[414px]:hidden min-w-[240px] min-h-screen p-4 bg-gray-100 overflow-y-auto">
          <CalendarCheckbox />
        </div>
        <div>
          <CalendarView />
        </div>
      </div>
    </div>
  );
};

export default Page;
