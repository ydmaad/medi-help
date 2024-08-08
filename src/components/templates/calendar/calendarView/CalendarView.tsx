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
import Image from "next/image";
import PillComponent from "@/components/molecules/MediScheduleCard";

export const MOCK_DATA = [
  {
    time: "12:00",
    pillName: "키커지는약",
    timeOfDay: "morning",
    hasTaken: true,
  },
  {
    time: "12:00",
    pillName: "똑똑해지는약",
    timeOfDay: "morning",
    hasTaken: false,
  },
  {
    time: "12:00",
    pillName: "잘생겨지는약",
    timeOfDay: "lunch",
    hasTaken: true,
  },
  {
    time: "12:00",
    pillName: "살빠지는약",
    timeOfDay: "lunch",
    hasTaken: false,
  },
  {
    time: "12:00",
    pillName: "돈버는약",
    timeOfDay: "dinner",
    hasTaken: false,
  },
  {
    time: "12:00",
    pillName: "영양제",
    timeOfDay: "dinner",
    hasTaken: true,
  },
  {
    time: "12:00",
    pillName: "진짜약",
    timeOfDay: "dinner",
    hasTaken: false,
  },
];

const CalendarView = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [tabNumber, setTabNumber] = useState<number>(0);
  const [timeOfDay, setTimeOfDay] = useState<string>("morning");
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
            if (event.calendar_medicine.length !== 0) {
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
            }
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
      <div className="w-full flex flex-col">
        <div className="relative w-[812px] aspect-square p-[10px] max-[414px]:w-[364px] ">
          <button
            onClick={handleButtonClick}
            className="absolute w-24 right-12 top-4 px-3 py-1 bg-brand-primary-500 text-sm text-white border border-sky-500 rounded-md hover:bg-white hover:text-sky-500 ease-in duration-300 max-[414px]:hidden"
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
        <div className="min-[414px]:hidden max-[414px]:w-[364px] p-[10px]  border border-[#F5F6F7] bg-[#FBFBFB] p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex justify-between gap-6 text-[16px] font-normal">
              <div
                className={`cursor-pointer ${
                  tabNumber === 0 ? "font-bold" : "text-[#7C7F86]"
                }`}
                onClick={() => setTabNumber(0)}
              >
                복약 리스트
              </div>
              <div
                className={`cursor-pointer ${
                  tabNumber === 1 ? "font-bold" : "text-[#7C7F86]"
                }`}
                onClick={() => setTabNumber(1)}
              >
                노트
              </div>
            </div>
            <div className="text-[16px] text-[#279EF9]">편집</div>
          </div>
          {tabNumber === 0 ? (
            <>
              <div className="flex gap-2 justify-start items-center mb-2">
                <button
                  onClick={() => setTimeOfDay("morning")}
                  className={`${
                    timeOfDay === "morning"
                      ? "rounded-full bg-[#9CD2FC] w-8 h-8 text-[12px] text-[#155189]"
                      : "rounded-full bg-[#F5F6F7] w-8 h-8 text-[12px] text-[#BCBFC1]"
                  } `}
                >
                  아침
                </button>
                <button
                  onClick={() => setTimeOfDay("lunch")}
                  className={`${
                    timeOfDay === "lunch"
                      ? "rounded-full bg-[#9CD2FC] w-8 h-8 text-[12px] text-[#155189]"
                      : "rounded-full bg-[#F5F6F7] w-8 h-8 text-[12px] text-[#BCBFC1]"
                  } `}
                >
                  점심
                </button>
                <button
                  onClick={() => setTimeOfDay("dinner")}
                  className={`${
                    timeOfDay === "dinner"
                      ? "rounded-full bg-[#9CD2FC] w-8 h-8 text-[12px] text-[#155189]"
                      : "rounded-full bg-[#F5F6F7] w-8 h-8 text-[12px] text-[#BCBFC1]"
                  } `}
                >
                  저녁
                </button>
              </div>
              <div className="flex flex-col w-full gap-2">
                {MOCK_DATA.filter((e) => e.timeOfDay === timeOfDay).map(
                  (ele) => (
                    <PillComponent key={ele.pillName} pill={ele} />
                  )
                )}
              </div>
            </>
          ) : null}
          {tabNumber === 1 ? (
            <textarea
              className="min-h-[125px] p-4 w-full text-[16px] font-normal resize-none"
              value={`신경불안약 먹으니까 너무 졸림. 약 복용 주기 4시간 지키면서 복용하기`}
            ></textarea>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default CalendarView;
