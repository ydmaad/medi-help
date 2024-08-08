"use client";

import React, { useEffect, useState } from "react";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import axios from "axios";
import { COLOR_OF_TIME, DATE_OFFSET, TIME_OF_TIME } from "@/constant/constant";
import DetailModal from "../calendarModal/DetailModal";
import { useAuthStore } from "@/store/auth";
import { Tables } from "@/types/supabase";
import uuid from "react-uuid";
import { ValueType } from "@/types/calendar";

const CalendarView = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [values, setValues] = useState<ValueType>({
    id: uuid(),
    user_id: "",
    medi_time: "morning",
    medicine_id: [],
    side_effect: "",
    start_date: new Date(new Date().getTime() + DATE_OFFSET)
      .toISOString()
      .split("T")[0],
  });

  const { user } = useAuthStore();

  type CalendarType = Tables<"calendar">;
  type BridgeType = Tables<"calendar_medicine">;
  type MedicinesType = Tables<"medications">;

  useEffect(() => {
    if (!user) {
      return;
    }

    const getCalendarData = async () => {
      try {
        const { data } = await axios.get(`/api/calendar?user_id=${user.id}`);

        {
          data.map((event: EventInput) => {
            const setEventList = (time: string) => {
              let eventList = event.calendar_medicine.filter(
                (medicine: any) => {
                  return medicine.medi_time === time;
                }
              );

              if (eventList.length !== 0) {
                setEvents((prev) => {
                  return [
                    ...prev,
                    {
                      groupId: event.id,
                      title: `${eventList[0].medications.medi_nickname} 외 ${
                        eventList.length - 1
                      }개`,
                      start: `${event.start_date} ${
                        TIME_OF_TIME[eventList[0].medi_time]
                      }`,
                      backgroundColor: COLOR_OF_TIME[eventList[0].medi_time],
                      extendProps: {
                        sideEffect: event.side_effect,
                        medi_time: eventList[0].medi_time,
                        medicineList: eventList.map(
                          (medicine: any) => medicine.medications.id
                        ),
                      },
                    },
                  ];
                });
              }
            };

            setEventList("morning");
            setEventList("afternoon");
            setEventList("evening");
          });
        }
      } catch (error) {
        console.log("axios error", error);
      }
    };

    getCalendarData();
  }, [user]);

  // 날짜 클릭 시 , value 에 날짜 set
  const handleDateClick = (event: DateClickArg) => {
    const newDate = new Date(event.date.getTime() + DATE_OFFSET)
      .toISOString()
      .split("T")[0];

    setValues((prev) => {
      return { ...prev, start_date: newDate };
    });

    setOpenDetailModal(true);
  };

  const handleButtonClick = () => {
    setOpenDetailModal(true);
  };

  return (
    <>
      <DetailModal
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
        events={events}
        setEvents={setEvents}
        values={values}
        setValues={setValues}
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
          events={events}
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
        />
      </div>
    </>
  );
};

export default CalendarView;
