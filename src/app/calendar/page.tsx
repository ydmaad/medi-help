"use client";

import React from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";

const page = () => {
  return (
    <>
      <div className="w-11/12 h-11/12">
        <FullCalendar plugins={[dayGridPlugin]} />
      </div>
    </>
  );
};

export default page;
