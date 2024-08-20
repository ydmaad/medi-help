"use client";
import ModalTitle from "@/components/atoms/ModalTitle";
import EditModalInner from "@/components/molecules/EditModalInner";
import { COLOR_OF_TIME, DATE_OFFSET, TIME_OF_TIME } from "@/constants/constant";
import { MedicinesType, ValuesType } from "@/types/calendar";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import {
  useEditStore,
  useEventsStore,
  useMedicinesStore,
  useValuesStore,
} from "@/store/calendar";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

const MobileEdit = () => {
  const [viewEvents, setViewEvents] = useState<boolean>(false);

  const { values, setValues } = useValuesStore();
  const { events, setEvents } = useEventsStore();
  const { edit, setEdit } = useEditStore();

  const router = useRouter();

  const { toast } = useToast();

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
    setValues({
      ...values,
      side_effect: values.side_effect ? values.side_effect.trim() : "",
    });

    postCalendar(values);

    toast.success("복용 기록이 저장되었습니다.");

    setEdit(false);
    setValues({
      ...values,
      medi_time: "morning",
      medicine_id: [],
      side_effect: "",
    });

    router.push("/calendar");
  };

  // 뒤로가기 버튼 onClick 함수
  const handleBackButtonClick = () => {
    router.push("/calendar");
  };

  return (
    <>
      <div className="w-11/12 min-w-96 h-5/8 min-h-[480px] py-6 bg-[#FBFBFB] desktop:px-6 mt-20 flex flex-col gap-[20px]">
        <div className="fixed top-0 left-0 right-0 z-20 flex desktop:hidden flex-row items-center justify-between p-4 bg-[#FBFBFB] h-[67px]">
          <button onClick={handleBackButtonClick}>
            <IoIosArrowBack className="text-[20px] hover:text-primary-500" />
          </button>
          <ModalTitle>하루 약 기록</ModalTitle>
          <button
            className="text-[16px] text-brand-primary-500 hover:text-brand-gray-800"
            onClick={handleSubmitButtonClick}
          >
            저장
          </button>
        </div>
        <EditModalInner viewEvents={viewEvents} setViewEvents={setViewEvents} />
      </div>
    </>
  );
};

export default MobileEdit;
