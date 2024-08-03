"use client";

import React, { useEffect, useState } from "react";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import axios from "axios";
import AddModal from "../calendarModal/AddModal";
import { EventsType } from "@/types/calendar";
import { COLOR_OF_TIME } from "@/constant/constant";
import DetailModal from "../calendarModal/DetailModal";
import { useAuthStore } from "@/store/auth";

const CalendarView = () => {
  const [events, setEvents] = useState<EventsType[]>([]);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [editDate, setEditDate] = useState<string>();
  const [editEvents, setEditEvents] = useState<EventsType[]>([]);

  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      return;
    }

    const getCalendarData = async () => {
      try {
        const { data } = await axios.get(`/api/calendar?user_id=${user.id}`);
        {
          data.map((el: any) => {
            el.medi_name.map((name: string) => {
              setEvents((prev) => {
                return [
                  ...prev,
                  {
                    groupId: el.id,
                    title: name,
                    start: el.start_date,
                    backgroundColor: COLOR_OF_TIME[el.medi_time],
                    borderColor: COLOR_OF_TIME[el.medi_time],
                    extendProps: { sideEffect: el.side_effect },
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
  }, [user]);

  const handleDateClick = (event: DateClickArg) => {
    const offset = 1000 * 60 * 60 * 9;
    const newDate = new Date(event.date.getTime() + offset)
      .toISOString()
      .split("T")[0];

    setEditDate(newDate);

    let editList = events.filter((event) => {
      return event.start?.toString().split("T")[0] === newDate;
    });

    setEditEvents(editList);

    if (editList.length !== 0) {
      setOpenDetailModal(true);
    }
  };

  const handleButtonClick = () => {
    setOpenAddModal(true);
  };

  return (
    <>
      <AddModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        setEvents={setEvents}
      />
      <DetailModal
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
        editEvents={editEvents}
        editDate={editDate}
      />
      <div className="relative p-8 w-11/12 h-7/12 fc-button ">
        <button
          onClick={handleButtonClick}
          className="absolute w-24 right-12 top-10 px-3 py-1 bg-brand-primary-500 text-sm text-white border border-sky-500 rounded-md hover:bg-white hover:text-sky-500 ease-in duration-300"
        >
          기록추가 +
        </button>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events as EventInput[]}
          dateClick={handleDateClick}
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
          // ariaHideApp={false}
        />
      </div>
    </>
  );
};

export default CalendarView;
