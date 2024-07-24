"use client";

import React, { useEffect } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import axios from "axios";

const page = () => {
  useEffect(() => {
    const getCalendarData = async () => {
      try {
        const data = await axios.get("/api/calendar");
        console.log(data);
        return data;
      } catch (error) {
        console.log("axios error", error);
      }
    };

    getCalendarData();
  }, []);
  return (
    <>
      <div className="w-10/12 h-11/12">
        <FullCalendar plugins={[dayGridPlugin]} />
      </div>
    </>
  );
};

export default page;
