import CalendarView from "@/components/templates/calendar/calendarView/CalendarView";
import CalendarCheckbox from "@/components/templates/calendar/calendarView/CalendarCheckbox";
import React from "react";

const Page = () => {
  return (
    <div className="flex justify-center w-full min-h-screen px-4"> {/* 전체를 감싸는 div */}
      <div className="flex w-full max-w-6xl"> {/* 캘린더와 체크박스를 묶는 div */}
        <div className="min-w-[240px] p-4 flex-shrink-0">
          <CalendarCheckbox />
        </div>
        <div className="flex-1 p-4">
          <CalendarView />
        </div>
      </div>
    </div>
  );
};

export default Page;
