"use client";

import React, { useEffect, useState } from "react";
import { Calendar, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import axios from "axios";
import TestModal from "../calendarModal/TestModal";

type eventsType = {
  id: string;
  title: string;
  start: Date;
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
        const { data } = await axios.get("/api/calendar");
        console.log(data);
        {
          data.map((el: any) => {
            let date = new Date(el.created_at);
            const addMinutes = (date: Date, minutes: number) => {
              date.setMinutes(date.getMinutes() + minutes);
              return date;
            };
            el.medi_name.map((name: string, idx: number) => {
              let newDate = addMinutes(date, idx * 2);
              console.log(newDate);
              setEvents((prev) => {
                return [
                  ...prev,
                  {
                    id: el.id,
                    title: name,
                    start: newDate,
                    backgroundColor: colorForTime[el.medi_time],
                    borderColor: colorForTime[el.medi_time],
                    textColor: "gray",
                  },
                ];
              });
            });
          });
        }
      } catch (error) {
        console.log("axios error", error);
      }
    };

    getCalendarData();
  }, []);

  console.log(events);

  const handleEventClick = (event: EventClickArg) => {
    console.log(event.event._def.publicId);
    setCalendarId(event.event._def.publicId);
    setOpenModal(true);
  };

  return (
    <>
      <TestModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        calendarId={calendarId}
      />
      <div className="relative p-8 w-full h-7/12 fc-button ">
        <button className="absolute right-20 top-10 px-2 py-1 bg-sky-500 text-white border-sky-500 rounded-md">
          기록추가 +
        </button>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          eventOverlap={false}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            omitZeroMinute: false,
            meridiem: false,
          }}
          headerToolbar={{
            left: "prev title next",
            center: "",
            right: "",
          }}
          locale="en"
          contentHeight={"auto"}
        />
      </div>
    </>
  );
};

export default CalendarView;
