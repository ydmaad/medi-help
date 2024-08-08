"use client";
import React, { useEffect, useState } from "react";
import PillComponent from "@/components/molecules/MediScheduleCard";
import ModalFilterButton from "@/components/atoms/ModalFilterButton";
import { MedicinesType, ValueType } from "@/types/calendar";
import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { EventInput } from "@fullcalendar/core";
import { handleContentChange } from "@/utils/calendar/calendarFunc";
import MediCheck from "../atoms/MediCheck";

interface Props {
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
  events: EventInput[];
  medicines: MedicinesType[];
  setMedicines: React.Dispatch<React.SetStateAction<MedicinesType[]>>;
}

const MobileCalendarView = ({
  values,
  setValues,
  events,
  medicines,
  setMedicines,
}: Props) => {
  const [tabNumber, setTabNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const { user } = useAuthStore();

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
        setIsLoading(false);
      } catch (error) {
        console.log("medi axios =>", error);
      }
    };

    getMedicines();
  }, [user]);

  useEffect(() => {
    let dateArr = values.start_date.split("-");
    setSelectedDate(`${dateArr[1]}월 ${dateArr[2]}일`);
  }, [values.start_date]);

  // time Category onClick 함수
  const handleTimeClick = (time: string) => {
    setValues((prev) => {
      return { ...prev, medicine_id: [], medi_time: time };
    });
  };

  // 작성 버튼 onClick 함수
  const handleWriteButtonClick = () => {
    setEdit(!edit);
  };

  // 저장 버튼 onClick 함수
  const handleSubmitButtonClick = () => {
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
          <>
            <div className="flex gap-2 justify-start items-center mb-[8px]">
              <ModalFilterButton
                values={values}
                handleTimeClick={handleTimeClick}
                time={"morning"}
              >
                아침
              </ModalFilterButton>
              <ModalFilterButton
                values={values}
                handleTimeClick={handleTimeClick}
                time={"afternoon"}
              >
                점심
              </ModalFilterButton>
              <ModalFilterButton
                values={values}
                handleTimeClick={handleTimeClick}
                time={"evening"}
              >
                저녁
              </ModalFilterButton>
            </div>
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
                : isLoading
                ? "Loading..."
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
          </>
        ) : null}
        {tabNumber === 1 ? (
          edit ? (
            <textarea
              className="min-h-[125px] p-4 w-full text-[16px] font-normal resize-none outline-none"
              onChange={(event) => handleContentChange(event, setValues)}
              value={values.side_effect}
            ></textarea>
          ) : (
            <div className="min-h-[125px] p-4 w-full text-[16px] font-normal">
              {values.side_effect}
            </div>
          )
        ) : null}
      </div>
    </>
  );
};

export default MobileCalendarView;
