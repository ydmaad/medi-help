"use client";
import ModalTitle from "@/components/atoms/ModalTitle";
import EditModalInner from "@/components/molecules/EditModalInner";
import { COLOR_OF_TIME, DATE_OFFSET, TIME_OF_TIME } from "@/constant/constant";
import { MedicinesType, ValuesType } from "@/types/calendar";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import { EventInput } from "@fullcalendar/core";
import { useValuesStore } from "@/store/calendar";

const MobileEdit = () => {
  const [medicines, setMedicines] = useState<MedicinesType[]>([]);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const { values, setValues } = useValuesStore();

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
    setEdit(!edit);
    setValues({
      ...values,
      medi_time: "morning",
      medicine_id: [],
      side_effect: "",
    });
  };

  return (
    <>
      <div className="w-1/4 min-w-96 h-5/8 min-h-[480px] p-6 mt-20 mx-auto flex flex-col gap-[20px] bg-white z-20 ">
        <div className="flex align-items py-1 mb-2 justify-between gap-2">
          <button>
            <IoIosArrowBack className="text-[20px]" />
          </button>
          <ModalTitle>하루 약 기록</ModalTitle>
          <button className="text-[16px] text-[#279EF9]">저장</button>
        </div>
        <EditModalInner />
      </div>
    </>
  );
};

export default MobileEdit;
