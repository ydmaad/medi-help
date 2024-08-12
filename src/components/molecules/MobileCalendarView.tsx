"use client";

import React, { useEffect, useState } from "react";
import { MedicinesType, ValuesType } from "@/types/calendar";
import axios from "axios";
import { COLOR_OF_TIME, DATE_OFFSET, TIME_OF_TIME } from "@/constant/constant";
import FilterComponent from "./FilterComponent";
import ViewNote from "../atoms/ViewNote";
import PillComponent from "./PillComponent";
import { useRouter } from "next/navigation";
import {
  useCalendarStore,
  useEditStore,
  useEventsStore,
  useMedicinesStore,
  useValuesStore,
} from "@/store/calendar";
import { EventInput } from "@fullcalendar/core";
import uuid from "react-uuid";
import { fi } from "date-fns/locale";

const MobileCalendarView = () => {
  const [tabNumber, setTabNumber] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const { values, setValues } = useValuesStore();
  const { events, setEvents } = useEventsStore();
  const { calendar, setCalendar } = useCalendarStore();
  const { medicines } = useMedicinesStore();
  const { setEdit } = useEditStore();

  const router = useRouter();

  useEffect(() => {
    let today = new Date(new Date().getTime() + DATE_OFFSET)
      .toISOString()
      .split("T")[0];

    if (calendar) {
      let filteredCalendar = calendar.filter((cal) => {
        return cal.start_date === today;
      });

      console.log(filteredCalendar);

      let editList = events?.filter((event) => {
        return event.start?.toString().split(" ")[0] === today;
      });

      let viewEvent = editList?.filter((event: EventInput) => {
        return event.extendProps.medi_time === "morning";
      })[0];

      setValues({
        ...values,
        id: filteredCalendar?.length ? filteredCalendar[0].id : uuid(),
        start_date: today,
        medi_time: "morning",
        side_effect: filteredCalendar.length
          ? filteredCalendar[0].side_effect
          : "",
        medicine_id: viewEvent ? viewEvent.extendProps.medicineList : [],
      });
    }
  }, [calendar]);

  useEffect(() => {
    if (values.start_date) {
      let dateArr = values.start_date.split("-");
      setSelectedDate(`${dateArr[0]}년 ${dateArr[1]}월 ${dateArr[2]}일`);
    }
  }, [values.start_date]);

  // Route Handler 통해서 POST 하는 함수
  const postCalendar = async (value: ValuesType) => {
    try {
      const { data } = await axios.post(`/api/calendar`, value);

      let deletedEvents = events.filter((event) => {
        return !(
          event.groupId === value.id &&
          event.extendProps.medi_time === value.medi_time
        );
      });

      if (value.medicine_id.length === 0) {
        setEvents([...deletedEvents]);
      }

      if (value.medicine_id.length !== 0) {
        setEvents([
          ...deletedEvents,
          {
            groupId: value.id,
            title: `${data[0][0].medications.medi_nickname} 외 ${
              value.medicine_id.length - 1
            }개`,
            start: `${
              new Date(new Date(values.start_date).getTime() + DATE_OFFSET)
                .toISOString()
                .split("T")[0]
            } ${TIME_OF_TIME[value.medi_time]}`,
            backgroundColor: COLOR_OF_TIME[value.medi_time],
            borderColor: COLOR_OF_TIME[value.medi_time],
            extendProps: {
              medi_time: value.medi_time,
              medicineList: value.medicine_id,
            },
          },
        ]);
      }

      return data;
    } catch (error) {
      console.log("Post Error", error);
    }
  };

  // 저장 버튼 onClick 함수
  const handleSubmitButtonClick = () => {
    postCalendar(values);
    setEdit(false);
    setValues({
      ...values,
      medi_time: "morning",
      medicine_id: [],
      side_effect: "",
    });
  };

  // 작성 버튼 onClick 함수
  const handleWriteButtonClick = () => {
    let filteredCalendar = calendar.filter((cal) => {
      return cal.start_date === values.start_date;
    });

    setValues({
      ...values,
      medi_time: "morning",
      side_effect: filteredCalendar.length
        ? filteredCalendar[0].side_effect
        : "",
    });
    setEdit(true);
    router.push("/calendar/edit");
  };

  return (
    <>
      <div className="max-[414px]:w-[344px] min-[415px]:hidden p-[10px] mx-[10px] border border-[#F5F6F7] bg-[#FBFBFB]">
        <div className="flex justify-between items-center mt-2 mb-4 px-1">
          <div className="flex justify-between gap-6 text-[16px] text-[#18181b] font-normal">
            {selectedDate}
          </div>
          <button
            onClick={handleWriteButtonClick}
            className="text-[16px] text-[#279EF9]"
          >
            작성
          </button>
        </div>
        <div className="flex gap-6 my-6 px-1 text-[16px] font-normal">
          <div
            className={`cursor-pointer text-[14px] ${
              tabNumber === 0 ? "font-bold" : "text-[#7C7F86]"
            }`}
            onClick={() => setTabNumber(0)}
          >
            복약 목록
          </div>
          <div
            className={`cursor-pointer text-[14px] ${
              tabNumber === 1 ? "font-bold" : "text-[#7C7F86]"
            }`}
            onClick={() => setTabNumber(1)}
          >
            노트
          </div>
        </div>
        {tabNumber === 0 ? (
          <div className="flex flex-col gap-4">
            <FilterComponent />
            <div className="flex flex-col items-center w-full gap-2">
              {medicines
                .filter((medi: MedicinesType) => {
                  return medi.time[values.medi_time] === true;
                })
                .map((medicine: MedicinesType, idx: number) => {
                  return <PillComponent key={idx} medicine={medicine} />;
                })}
            </div>
          </div>
        ) : null}
        {tabNumber === 1 ? <ViewNote values={values} /> : null}
      </div>
    </>
  );
};

export default MobileCalendarView;
