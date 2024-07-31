"use client";

import React, { useEffect, useState } from "react";
import { Calendar, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import axios from "axios";
import TestModal from "../calendarModal/TestModal";
import AddModal from "../calendarModal/AddModal";

// type 파일 - eventsType, valuesType,
// constant 폴더 및 파일 만들어서 정리
// event props 넘겨서 상태관리 해주기
// react-modal 로 변경

type eventsType = {
  title: string;
  start: Date;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

const CalendarView = () => {
  const [events, setEvents] = useState<eventsType[]>([]);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [calendarId, setCalendarId] = useState<string>("");

  const colorForTime: { [key: string]: string } = {
    morning: "#FFD9D9",
    afternoon: "#FEE6C9",
    evening: "#D2F0FF",
  };

  useEffect(() => {
    const getCalendarData = async () => {
      try {
        const { data } = await axios.get("/api/calendar");
        console.log(data);
        {
          data.map((el: any) => {
            el.medi_name.map((name: string, idx: number) => {
              setEvents((prev) => {
                return [
                  ...prev,
                  {
                    title: name,
                    start: el.created_at,
                    backgroundColor: colorForTime[el.medi_time],
                    borderColor: colorForTime[el.medi_time],
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
    console.log(event.event._def.publicId);
    setCalendarId(event.event._def.publicId);
    setOpenModal(true);
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
      <AddModal openAddModal={openAddModal} setOpenAddModal={setOpenAddModal} />
      <div className="relative p-8 w-11/12 h-7/12 fc-button ">
        <button
          onClick={handleButtonClick}
          className="absolute w-24 right-20 top-10 px-3 py-1 bg-brand-primary-500 text-sm text-white border border-sky-500 rounded-md hover:bg-white hover:text-sky-500 ease-in duration-300"
        >
          기록추가 +
        </button>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          eventOverlap={false}
          displayEventTime={false}
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
