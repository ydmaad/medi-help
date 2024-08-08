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
import { COLOR_OF_TIME, DATE_OFFSET, TIME_OF_TIME } from "@/constant/constant";

interface Props {
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
  events: EventInput[];
  setEvents: React.Dispatch<React.SetStateAction<EventInput[]>>;
  medicines: MedicinesType[];
  setMedicines: React.Dispatch<React.SetStateAction<MedicinesType[]>>;
}

const MobileCalendarView = ({
  values,
  setValues,
  events,
  setEvents,
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
              className={`min-h-[125px] p-4 w-full text-[16px] font-normal resize-none outline-none placeholder:text-[14px] placeholder:text-brand-gray-400`}
              onChange={(event) => handleContentChange(event, setValues)}
              name="side_effect"
              value={values.side_effect}
              placeholder="복약 후 몸 상태나 오늘 하루 복약에 대한 한 마디"
            ></textarea>
          ) : (
            <div
              className={`min-h-[125px] p-4 w-full border border-brand-gray-50 bg-brand-gray-50 font-normal ${
                values.side_effect.length !== 0
                  ? "text-[16px] text-brand-gray-800"
                  : "text-[14px] text-brand-gray-400"
              }  `}
            >
              {values.side_effect.length !== 0
                ? values.side_effect
                : "복약 후 몸 상태나 오늘 하루 복약에 대한 한 마디"}
            </div>
          )
        ) : null}
      </div>
    </>
  );
};

export default MobileCalendarView;
