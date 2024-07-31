"use client";

import React, { useEffect, useState } from "react";
import { Calendar, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import axios from "axios";
import TestModal from "../calendarModal/TestModal";
import AddModal from "../calendarModal/AddModal";
import { EventsType } from "@/types/calendar";
import { COLOR_OF_TIME } from "@/constant/constant";

const CalendarView = () => {
  const [events, setEvents] = useState<EventsType[]>([]);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [calendarId, setCalendarId] = useState<string>("");

  useEffect(() => {
    const getCalendarData = async () => {
      try {
        const { data } = await axios.get("/api/calendar");
        console.log(data);
        {
          data.map((el: any) => {
            el.medi_name.map((name: string) => {
              setEvents((prev) => {
                return [
                  ...prev,
                  {
                    title: name,
                    start: el.start_date,
                    backgroundColor: COLOR_OF_TIME[el.medi_time],
                    borderColor: COLOR_OF_TIME[el.medi_time],
                    textColor: "white",
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
    setOpenAddModal(true);
    console.log(event.view.calendar.getDate());
  };

  const handleButtonClick = () => {
    setOpenAddModal(true);
  };

  return (
    <>
      <TestModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        calendarId={calendarId}
      />
      <AddModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        setEvents={setEvents}
      />
      <div className="relative p-8 w-11/12 h-7/12 fc-button ">
        <button
          onClick={handleButtonClick}
          className="absolute w-24 right-20 top-10 px-3 py-1 bg-brand-primary-500 text-sm text-white border border-sky-500 rounded-md hover:bg-white hover:text-sky-500 ease-in duration-300"
        >
          기록추가 +
        </button>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleEventClick}
          selectable={true}
          eventOverlap={false}
          displayEventTime={false}
          headerToolbar={{
            left: "prev title next",
            center: "",
            right: "",
          }}
          locale="en"
          contentHeight={"auto"}
          fixedWeekCount={false}
        />
      </div>
    </>
  );
};

export default CalendarView;
