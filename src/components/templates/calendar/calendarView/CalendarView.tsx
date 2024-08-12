"use client";

import React, { useEffect, useState } from "react";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import axios from "axios";
import { COLOR_OF_TIME, DATE_OFFSET, TIME_OF_TIME } from "@/constant/constant";
import DetailModal from "../calendarModal/DetailModal";
import { useAuthStore } from "@/store/auth";
import { Tables } from "@/types/supabase";
import { MedicinesType } from "@/types/calendar";
import MobileCalendarView from "@/components/molecules/MobileCalendarView";
import FullCalendar from "@fullcalendar/react";
import {
  useCalendarStore,
  useEventsStore,
  useMedicinesStore,
  useValuesStore,
} from "@/store/calendar";
import uuid from "react-uuid";

const CalendarView = () => {
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [viewEvents, setViewEvents] = useState<boolean>(false);

  const { user } = useAuthStore();
  const { values, setValues } = useValuesStore();
  const { calendar, setCalendar } = useCalendarStore();
  const { events, setEvents } = useEventsStore();
  const { medicines, setMedicines } = useMedicinesStore();

  type CalendarType = Tables<"calendar">;
  type BridgeType = Tables<"calendar_medicine">;
  type MedicineType = Tables<"medications">;

  useEffect(() => {
    if (user) {
      setValues({ ...values, user_id: user.id });
    }
  }, [user]);

  useEffect(() => {
    const getMedicines = async () => {
      try {
        if (user) {
          const { data } = await axios.get(
            `/api/calendar/medi?user_id=${user.id}`
          );

          const newMedicines: MedicinesType[] = [];

          data.medicationRecords.map((record: any) => {
            newMedicines.push({
              id: record.id,
              name: record.medi_nickname,
              time: record.times,
              notification_time: record.notification_time,
            });
          });

          setMedicines(newMedicines);
          return data;
        }
      } catch (error) {
        console.log("medi axios =>", error);
      }
    };

    getMedicines();
  }, [user]);

  useEffect(() => {
    const getEventsData = async () => {
      try {
        if (user) {
          const { data } = await axios.get(`/api/calendar?user_id=${user.id}`);

          {
            const newEvents: EventInput[] = [];
            data.map((event: EventInput) => {
              if (event.calendar_medicine.length !== 0) {
                const setEventList = (time: string) => {
                  let eventList = event.calendar_medicine.filter(
                    (medicine: any) => {
                      return medicine.medi_time === time;
                    }
                  );

                  let countMedicines = eventList.length;

                  if (countMedicines !== 0) {
                    let medicineNickname =
                      eventList[0].medications.medi_nickname;
                    newEvents.push({
                      groupId: event.id,
                      title:
                        countMedicines !== 1
                          ? `${medicineNickname} 외 ${countMedicines - 1}개`
                          : `${medicineNickname}`,
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
                    });
                  }
                };

                setEventList("morning");
                setEventList("afternoon");
                setEventList("evening");
              }
            });
            setEvents(newEvents);
          }
        }
      } catch (error) {
        console.log("axios error", error);
      }
    };

    getEventsData();
  }, [user]);

  useEffect(() => {
    const getCalendarData = async () => {
      try {
        if (user) {
          const { data } = await axios.get(
            `/api/calendar/sideEffect?user_id=${user.id}`
          );

          {
            const newCalendar: CalendarType[] = [];
            data.map((info: CalendarType) => {
              newCalendar.push({
                id: info.id,
                user_id: info.user_id,
                created_at: info.created_at,
                side_effect: info.side_effect,
                start_date: info.start_date,
              });
            });
            setCalendar(newCalendar);
          }
          return data;
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    getCalendarData();
  }, [user]);

  // 날짜 클릭 시 , value 에 날짜 set
  const handleDateClick = (event: DateClickArg) => {
    let newDate = new Date(event.date.getTime() + DATE_OFFSET)
      .toISOString()
      .split("T")[0];

    let filteredCalendar = calendar.filter((cal) => {
      return cal.start_date === newDate;
    });

    let editList = events.filter((event) => {
      return event.start?.toString().split(" ")[0] === newDate;
    });

    let viewEvent = editList.filter((event: EventInput) => {
      return event.extendProps.medi_time === "morning";
    })[0];

    setValues({
      ...values,
      id: filteredCalendar.length ? filteredCalendar[0].id : uuid(),
      start_date: newDate,
      medi_time: "morning",
      side_effect: filteredCalendar.length
        ? filteredCalendar[0].side_effect
        : "",
      medicine_id: viewEvent ? viewEvent.extendProps.medicineList : [],
    });

    setOpenDetailModal(true);
  };

  // 기록하기 버튼 클릭
  const handleButtonClick = () => {
    let today = new Date(new Date().getTime() + DATE_OFFSET)
      .toISOString()
      .split("T")[0];

    let filteredCalendar = calendar.filter((cal) => {
      return cal.start_date === today;
    });

    let editList = events.filter((event) => {
      return event.start?.toString().split(" ")[0] === today;
    });

    let viewEvent = editList.filter((event: EventInput) => {
      return event.extendProps.medi_time === "morning";
    })[0];

    setValues({
      ...values,
      id: filteredCalendar.length ? filteredCalendar[0].id : uuid(),
      start_date: today,
      medi_time: "morning",
      side_effect: filteredCalendar.length
        ? filteredCalendar[0].side_effect
        : "",
      medicine_id: viewEvent ? viewEvent.extendProps.medicineList : [],
    });

    setOpenDetailModal(true);
  };

  return (
    <>
      <DetailModal
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
      />
      <div className="w-full flex flex-col mt-20">
        <div className="relative w-[812px] aspect-square p-[10px] max-[414px]:w-[364px] ">
          <button
            onClick={handleButtonClick}
            className="absolute w-24 right-12 top-4 px-3 py-1 bg-brand-primary-500 text-sm text-white border border-sky-500 rounded-md hover:bg-white hover:text-sky-500 ease-in duration-300 max-[414px]:hidden"
          >
            기록추가
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
            locale="ko"
            contentHeight={"auto"}
            fixedWeekCount={false}
            dayCellContent={(arg) => {
              return <i>{arg.dayNumberText.replace("일", "")}</i>;
            }}
          />
        </div>
        <MobileCalendarView />
      </div>
    </>
  );
};

export default CalendarView;
