"use client";

import React, { useEffect, useState } from "react";
import { MedicinesType } from "@/types/calendar";
import { DATE_OFFSET } from "@/constants/constant";
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
import { useToast } from "@/hooks/useToast";

const MobileCalendarView = () => {
  const [tabNumber, setTabNumber] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const { values, setValues } = useValuesStore();
  const { events } = useEventsStore();
  const { calendar } = useCalendarStore();
  const { medicines } = useMedicinesStore();
  const { setEdit } = useEditStore();

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    let today = new Date(new Date().getTime() + DATE_OFFSET)
      .toISOString()
      .split("T")[0];

    if (calendar) {
      let filteredCalendar = calendar.filter((cal) => {
        return cal.start_date === today;
      });

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

  // 작성 버튼 onClick 함수
  const handleWriteButtonClick = () => {
    let filteredCalendar = calendar.filter((cal) => {
      return cal.start_date === values.start_date;
    });

    if (medicines.length === 0) {
      return toast.warning("약 등록 후 이용해주세요!");
    }

    setValues({
      ...values,
      id: filteredCalendar.length ? filteredCalendar[0].id : uuid(),
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
      <div className="w-11/12 min-w-[335px] desktop:hidden p-[10px] box-content bg-[#FBFBFB]">
        <div className="flex justify-between items-center mt-2 mb-4 px-1">
          <div className="flex justify-between gap-6 text-[14px] text-brand-gray-600 font-normal">
            {selectedDate}
          </div>
          <button
            onClick={handleWriteButtonClick}
            className="text-[16px] text-brand-primary-500 hover:text-brand-gray-800"
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
            <div className="flex flex-col items-center w-full h-44 min-h-32 gap-2 overflow-y-auto">
              {medicines.length === 0 ? (
                <div className="my-4 text-[15px] text-brand-gray-600">
                  복용 중인 약이 없습니다.
                </div>
              ) : (
                medicines
                  .filter((medi: MedicinesType) => {
                    return medi.time[values.medi_time] === true;
                  })
                  .map((medicine: MedicinesType, idx: number) => {
                    return <PillComponent key={idx} medicine={medicine} />;
                  })
              )}
            </div>
          </div>
        ) : null}
        {tabNumber === 1 ? <ViewNote values={values} /> : null}
      </div>
    </>
  );
};

export default MobileCalendarView;
