"use client";

import React, { useEffect, useState } from "react";
import { Calendar, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import axios from "axios";
import AddModal from "../calendarModal/AddModal";

type eventsType = {
  id: string;
  title: string;
  start: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

const CalendarView = () => {
  const [events, setEvents] = useState<eventsType[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [calendarId, setCalendarId] = useState<string>("");

  const colorForTime: { [key: string]: string } = {
    "아침 복용": "#FFD9D9",
    "점심 복용": "#FEE6C9",
    "저녁 복용": "#D2F0FF",
  };

  useEffect(() => {
    const getCalendarData = async () => {
      try {
        const { data } = await axios.get("/api/test_calendar");
        console.log(data);
        {
          data.map((el: { [key: string]: string }) => {
            setEvents((prev) => {
              return [
                ...prev,
                {
                  id: el.id,
                  title: el.name,
                  start: el.time?.split("T")[0],
                  backgroundColor: colorForTime[el.medi_time],
                  borderColor: colorForTime[el.medi_time],
                  textColor: "gray",
                },
              ];
            });
          });
        }
      } catch (error) {
        console.log("axios error", error);
      }
    };

    getCalendarData();
  }, []);

  const handleDayContent = () => {
    let date = document.querySelectorAll(".fc-daygrid-day-number");
    console.log(typeof date);
    const dateArr = Array.from(date).filter((item) => true);
    return dateArr.map((day) => day.innerHTML?.replace("일", ""));
  };

  // handleDayContent();

  const handleEventClick = (event: EventClickArg) => {
    console.log(event.event._def.publicId);
    setCalendarId(event.event._def.publicId);
    setOpenModal(true);
  };

  return (
    <>
      <AddModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        calendarId={calendarId}
      />
      <div className="p-8 w-full h-full">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          headerToolbar={{
            left: "prev title next",
            center: "",
            right: "",
          }}
          locale="en"
        />
      </div>
    </>
  );
};

export default CalendarView;
