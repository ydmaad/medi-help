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
import { MedicinesType, ValueType } from "@/types/calendar";
import MobileCalendarView from "@/components/molecules/MobileCalendarView";
import { setViewMedicines } from "@/utils/calendar/calendarFunc";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

const CalendarView = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [medicines, setMedicines] = useState<MedicinesType[]>([]);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [viewEvents, setViewEvents] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
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
  type MedicineType = Tables<"medications">;

  useEffect(() => {
    if (user) {
      setValues((prev) => {
        return { ...prev, user_id: user.id };
      });
    }
  }, [user]);

  useEffect(() => {
    const getMedicines = async () => {
      try {
        if (user) {
          const { data } = await axios.get(
            `/api/calendar/medi?user_id=${user.id}`
          );

          data.medicationRecords.map((record: any) => {
            setMedicines((prev) => {
              return [
                ...prev,
                {
                  id: record.id,
                  name: record.medi_nickname,
                  time: record.times,
                },
              ];
            });
          });
          return data;
        }
      } catch (error) {
        console.log("medi axios =>", error);
      }
    };

    getMedicines();
  }, [user]);

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

                let countMedicines = eventList.length;
                let medicineNickname = eventList[0].medications.medi_nickname;

                if (countMedicines !== 0) {
                  setEvents((prev) => {
                    return [
                      ...prev,
                      {
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
  }, [values.user_id]);

  // input 창에 sideEffect Set.
  const setSideEffect = () => {
    const getSideEffect = async (start_date: string) => {
      try {
        if (!user) {
          throw Error("User is required.");
        }

        const { data } = await axios.get(
          `/api/calendar/sideEffect/${start_date}?user_id=${user.id}`
        );

        if (data.length !== 0) {
          setValues((prev) => {
            return { ...prev, side_effect: data[0].side_effect };
          });
        }

        if (data.length === 0) {
          setValues((prev) => {
            return { ...prev, side_effect: "" };
          });
        }

        return data;
      } catch (error) {
        if (isDynamicServerError(error)) {
          throw error;
        }
        console.log("Get SideEffect Error", error);
      }
    };

    getSideEffect(values.start_date);
  };

  // 날짜 클릭 시 , value 에 날짜 set
  const handleDateClick = (event: DateClickArg) => {
    const newDate = new Date(event.date.getTime() + DATE_OFFSET)
      .toISOString()
      .split("T")[0];

    setValues((prev) => {
      return { ...prev, start_date: newDate, medi_time: "morning" };
    });

    setOpenDetailModal(true);
  };

  const handleButtonClick = () => {
    setViewMedicines({ events, values, setValues, setViewEvents });
    setSideEffect();
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
        medicines={medicines}
        setMedicines={setMedicines}
        setSideEffect={setSideEffect}
        edit={edit}
        setEdit={setEdit}
      />
      <div className="w-full flex flex-col mt-8">
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
        <MobileCalendarView
          values={values}
          setValues={setValues}
          events={events}
          setEvents={setEvents}
          medicines={medicines}
          setMedicines={setMedicines}
          edit={edit}
          setEdit={setEdit}
        />
      </div>
    </>
  );
};

export default CalendarView;
