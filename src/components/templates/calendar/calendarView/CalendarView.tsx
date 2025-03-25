"use client";

import React, { useEffect, useState } from "react";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { DATE_OFFSET } from "@/constants/constant";
import DetailModal from "../calendarModal/DetailModal";
import AddMediModal from "../calendarModal/AddMediModal"; // Import AddMediModal
import MobileCalendarView from "@/components/molecules/MobileCalendarView";
import FullCalendar from "@fullcalendar/react";
import {
  useCalendarStore,
  useEventsStore,
  useMedicinesStore,
  useValuesStore,
} from "@/store/calendar";
import { GoPlus } from "react-icons/go";
import MobileAddMedi from "@/components/molecules/MobileAddMedi";
import { useToast } from "@/hooks/useToast";
import TimeColor from "@/components/atoms/TimeColor";
import axios from "axios";

const CalendarView = () => {
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [openAddMediModal, setOpenAddMediModal] = useState<boolean>(false);
  const [openMobileAddMedi, setOpenMobileAddMedi] = useState<boolean>(false);

  const [hasEvents, setHasEvents] = useState<boolean>(false);
  const [mediNames, setMediNames] = useState<string[]>([]);

  const { values, setValues } = useValuesStore();
  const { calendar } = useCalendarStore();
  const { events } = useEventsStore();
  const { medicines, setMedicines } = useMedicinesStore();

  const { toast } = useToast();

  useEffect(() => {
    const fetchMediNames = async () => {
      try {
        const response = await axios.get("/api/calendar/medi/names");
        setMediNames(
          response.data.map((item: { itemName: string }) => item.itemName)
        );
      } catch (error) {
        console.error("Failed to fetch medi names:", error);
      }
    };

    fetchMediNames();
  }, []);

  // 날짜 클릭 시 , value 에 날짜 set
  const handleDateClick = (event: DateClickArg) => {
    let newDate = new Date(event.date.getTime() + DATE_OFFSET)
      .toISOString()
      .split("T")[0];

    let filteredCalendar = calendar.filter((cal: any) => {
      return cal.start_date === newDate;
    });

    let editList = events.filter((event: any) => {
      return event.start?.toString().split(" ")[0] === newDate;
    });

    let viewEvent = editList.filter((event: EventInput) => {
      return event.extendProps.medi_time === "morning";
    })[0];

    if (filteredCalendar.length || editList.length) {
      setHasEvents(true);
    } else {
      setHasEvents(false);
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

    let filteredCalendar = calendar.filter((cal: any) => {
      return cal.start_date === today;
    });

    let editList = events.filter((event: any) => {
      return event.start?.toString().split(" ")[0] === today;
    });

    let viewEvent = editList.filter((event: EventInput) => {
      return event.extendProps.medi_time === "morning";
    })[0];

    if (filteredCalendar.length || editList.length) {
      setHasEvents(true);
    } else {
      setHasEvents(false);
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
        hasEvents={hasEvents}
        setHasEvents={setHasEvents}
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
        mediNames={mediNames}
        setMediNames={setMediNames}
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
        mediNames={mediNames}
        setMediNames={setMediNames}
      />
      <div className="desktop:static w-full mx-auto flex flex-col items-center gap-4">
        <div className="relative min-w-[335px]">
          <div className="absolute w-3/4 flex items-center justify-normal min-[1301px]:justify-between right-0 max-[1300px]:justify-end desktop:top-1.5 ">
            <div className="absolute desktop:static flex flex-row items-center right-1 top-[12px] gap-2 text-xs desktop:text-sm max-[1300px]:hidden max-[769px]:flex px-2 desktop:px-0">
              <div className="flex items-center">
                <TimeColor time={"morning"} />
                아침
              </div>
              <div className="flex items-center">
                <TimeColor time={"afternoon"} />
                점심
              </div>
              <div className="flex items-center">
                <TimeColor time={"evening"} />
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
              eventContent={(arg) => {
                return (
                  <>
                    <TimeColor
                      time={arg.event.extendedProps.extendProps.medi_time}
                    />
                    <div className="hidden desktop:block text-[0.8rem]">
                      {arg.event.title.split(" ")[0]}
                      <span>
                        {arg.event.title.split(" ").slice(1, 3).join(" ")}
                      </span>
                    </div>
                  </>
                );
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
