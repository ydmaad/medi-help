"use client";

import React, { useEffect, useState } from "react";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import axios from "axios";
import { COLOR_OF_TIME, DATE_OFFSET, TIME_OF_TIME } from "@/constants/constant";
import DetailModal from "../calendarModal/DetailModal";
import AddMediModal from "../calendarModal/AddMediModal"; // Import AddMediModal
import { useAuthStore } from "@/store/auth";
import { Tables } from "@/types/supabase";
import { MedicinesType } from "@/types/calendar";
import MobileCalendarView from "@/components/molecules/MobileCalendarView";
import FullCalendar from "@fullcalendar/react";
import {
  useCalendarStore,
  useEventsStore,
  useMedicinesStore,
  useMediNameFilter,
  useValuesStore,
} from "@/store/calendar";
import { GoPlus } from "react-icons/go";
import MobileAddMedi from "@/components/molecules/MobileAddMedi";
import { useToast } from "@/hooks/useToast";


const CalendarView = () => {
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [openAddMediModal, setOpenAddMediModal] = useState<boolean>(false); // Add state for AddMediModal
  const [viewEvents, setViewEvents] = useState<boolean>(false);
  const [openMobileAddMedi, setOpenMobileAddMedi] = useState<boolean>(false);

  const { user } = useAuthStore();
  const { values, setValues } = useValuesStore();
  const { calendar, setCalendar } = useCalendarStore();
  const { events, setEvents } = useEventsStore();
  const { medicines, setMedicines } = useMedicinesStore();
  const { mediNames, setMediNames } = useMediNameFilter();

  const { toast } = useToast();

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

          const newEvents: EventInput[] = [];
          data.map((event: EventInput) => {
            if (event.calendar_medicine.length !== 0) {
              const setEventList = (time: string) => {
                let eventList = event.calendar_medicine.filter(
                  (medicine: any) => {
                    return medicine.medi_time === time;
                  }
                );

                const newEventList = eventList.filter((e: any) => {
                  return mediNames.includes(e.medications.medi_nickname);
                });

                let countMedicines = newEventList.length;

                if (countMedicines !== 0) {
                  let medicineNickname =
                    newEventList[0].medications.medi_nickname;
                  newEvents.push({
                    groupId: event.id,
                    title:
                      countMedicines !== 1
                        ? `${medicineNickname} 외 ${countMedicines - 1}개`
                        : `${medicineNickname}`,
                    start: `${event.start_date} ${
                      TIME_OF_TIME[newEventList[0].medi_time]
                    }`,
                    backgroundColor: COLOR_OF_TIME[newEventList[0].medi_time],
                    extendProps: {
                      medi_time: newEventList[0].medi_time,
                      medicineList: newEventList.map(
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
      } catch (error) {
        console.log("axios error", error);
      }
    };

    getEventsData();
  }, [user, mediNames]);

  useEffect(() => {
    const getCalendarData = async () => {
      try {
        if (user) {
          const { data } = await axios.get(
            `/api/calendar/sideEffect?user_id=${user.id}`
          );

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

    if (filteredCalendar.length || editList.length) {
      setViewEvents(true);
    } else {
      setViewEvents(false);
    }

    if (medicines.length === 0) {
      return toast.warning("약 등록 후 이용해주세요!");
    }

    setValues({
      ...values,
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

    if (filteredCalendar.length || editList.length) {
      setViewEvents(true);
    } else {
      setViewEvents(false);
    }

    if (medicines.length === 0) {
      return toast.warning("약 등록 후 이용해주세요!");
    }

    setValues({
      ...values,
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
        viewEvents={viewEvents}
        setViewEvents={setViewEvents}
      />
      <AddMediModal
        isOpen={openAddMediModal}
        onRequestClose={() => setOpenAddMediModal(false)}
        onAdd={(newMediRecord) => {
          console.log("New Medi Record:", newMediRecord);
          setMedicines([
            ...medicines,
            {
              id: newMediRecord.id,
              name: newMediRecord.medi_nickname,
              time: newMediRecord.times,
              notification_time: newMediRecord.notification_time,
            },
          ]);
          toast.success("약이 성공적으로 등록되었습니다.");
        }}
        toast={toast}
      />
      <MobileAddMedi
        isOpen={openMobileAddMedi}
        onRequestClose={() => setOpenMobileAddMedi(false)}
        onAdd={(newMediRecord) => {
          console.log("New Medi Record:", newMediRecord);
          setMedicines([
            ...medicines,
            {
              id: newMediRecord.id,
              name: newMediRecord.medi_nickname,
              time: newMediRecord.times,
              notification_time: newMediRecord.notification_time,
            },
          ]);
        }}
      />
      <div className="desktop:static w-full mx-auto flex flex-col items-center gap-4">
        <div className="relative min-w-[335px]">
          <div className="absolute w-3/4 flex items-center justify-normal min-[1301px]:justify-between right-0 max-[1300px]:justify-end desktop:top-1.5 ">
            <div className="absolute desktop:static flex flex-row items-center right-1 top-[12px] gap-2 text-xs desktop:text-sm max-[1300px]:hidden max-[769px]:flex px-2 desktop:px-0">
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full bg-[#bce1fd] inline-block mr-1`}
                />
                아침
              </div>

              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full bg-[#6ebefb] inline-block mr-1`}
                />
                점심
              </div>
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full bg-[#103769] inline-block mr-1`}
                />
                저녁
              </div>
            </div>
            <div className="flex gap-2 ">
              <button
                onClick={() => setOpenAddMediModal(true)} // Update onClick to toggle AddMediModal
                className="w-24 px-3 py-1 bg-brand-primary-50 text-sm text-brand-primary-500 border border-brand-primary-50 rounded-[4px] hover:border-brand-primary-500 ease-in duration-300 hidden desktop:block outline-none"
              >
                약 등록
              </button>

              <button
                onClick={handleButtonClick}
                className="w-24 px-3 py-1 bg-brand-primary-500 text-sm text-white border border-brand-primary-500 rounded-[4px] hover:bg-brand-primary-50 hover:text-brand-primary-500 ease-in duration-300 hidden desktop:block outline-none"
              >
                기록추가
              </button>
            </div>
          </div>
          <div>
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
        </div>
        <MobileCalendarView />
        <button
          onClick={() => setOpenMobileAddMedi(true)}
          className="desktop:hidden fixed w-[60px] h-[60px] rounded-full bottom-10 right-10 flex items-center justify-center bg-brand-primary-50 text-[32px] text-brand-primary-500 drop-shadow-lg z-5 hover:scale-105 ease-in duration-300"
        >
          <GoPlus />
        </button>
      </div>
    </>
  );
};

export default CalendarView;
