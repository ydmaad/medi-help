"use client";
import React, { useEffect, useState } from "react";
import { MedicinesType, ValueType } from "@/types/calendar";
import axios from "axios";
import { EventInput } from "@fullcalendar/core";
import MediCheck from "../atoms/MediCheck";
import { COLOR_OF_TIME, DATE_OFFSET, TIME_OF_TIME } from "@/constant/constant";
import FilterComponent from "./FilterComponent";
import CalendarEditNote from "../atoms/EditNote";
import PillComponent from "./PillComponent";
import ViewNote from "../atoms/ViewNote";

interface Props {
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
  events: EventInput[];
  setEvents: React.Dispatch<React.SetStateAction<EventInput[]>>;
  medicines: MedicinesType[];
  setMedicines: React.Dispatch<React.SetStateAction<MedicinesType[]>>;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileCalendarView = ({
  values,
  setValues,
  events,
  setEvents,
  medicines,
  setMedicines,
  edit,
  setEdit,
}: Props) => {
  const [tabNumber, setTabNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    let dateArr = values.start_date.split("-");
    setSelectedDate(`${dateArr[0]}년 ${dateArr[1]}월 ${dateArr[2]}일`);
  }, [values.start_date]);

  // Route Handler 통해서 POST 하는 함수
  const postCalendar = async (value: ValueType) => {
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
    setEdit(!edit);
    setValues({
      ...values,
      medi_time: "morning",
      medicine_id: [],
      side_effect: "",
    });
  };

  // 작성 버튼 onClick 함수
  const handleWriteButtonClick = () => {
    setEdit(!edit);
  };

  return (
    <>
      <div className="max-[414px]:w-[344px] min-[415px]:hidden p-[10px] mx-[10px] border border-[#F5F6F7] bg-[#FBFBFB]">
        <div className="flex justify-between items-center mt-2 mb-4 px-1">
          <div className="flex justify-between gap-6 text-[16px] text-[#18181b] font-normal">
            {selectedDate}
          </div>
          <button
            onClick={edit ? handleSubmitButtonClick : handleWriteButtonClick}
            className="text-[16px] text-[#279EF9]"
          >
            {edit ? "저장" : "작성"}
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
            <FilterComponent values={values} setValues={setValues} />
            <div className="flex flex-col items-center w-full gap-2">
              {edit
                ? medicines
                    .filter((medi: MedicinesType) => {
                      return medi.time[values.medi_time] === true;
                    })
                    .map((medicine: MedicinesType, idx: number) => {
                      return (
                        <MediCheck
                          key={idx}
                          medicine={medicine}
                          values={values}
                          setValues={setValues}
                          idx={idx}
                        />
                      );
                    })
                : medicines
                    .filter((medi: MedicinesType) => {
                      return medi.time[values.medi_time] === true;
                    })
                    .map((medicine: MedicinesType, idx: number) => {
                      return (
                        <PillComponent
                          key={idx}
                          medicine={medicine}
                          events={events}
                          values={values}
                          setValues={setValues}
                        />
                      );
                    })}
            </div>
          </div>
        ) : null}
        {tabNumber === 1 ? (
          edit ? (
            <CalendarEditNote values={values} setValues={setValues} />
          ) : (
            <ViewNote values={values} />
          )
        ) : null}
      </div>
    </>
  );
};

export default MobileCalendarView;
