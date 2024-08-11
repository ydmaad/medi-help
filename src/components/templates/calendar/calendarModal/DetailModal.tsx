"use client";

import ModalButton from "@/components/atoms/ModalButton";
import ModalCloseButton from "@/components/atoms/ModalCloseButton";
import ModalTitle from "@/components/atoms/ModalTitle";
import ModalInner from "@/components/molecules/ModalInner";
import { COLOR_OF_TIME, DATE_OFFSET, TIME_OF_TIME } from "@/constant/constant";
import { useAuthStore } from "@/store/auth";
import { MedicinesType, ValueType } from "@/types/calendar";
import {
  handleContentChange,
  setViewMedicines,
} from "@/utils/calendar/calendarFunc";
import { EventInput } from "@fullcalendar/core";
import axios from "axios";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import uuid from "react-uuid";

interface Props {
  openDetailModal: boolean;
  setOpenDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
  events: EventInput[];
  setEvents: React.Dispatch<React.SetStateAction<EventInput[]>>;
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
  medicines: MedicinesType[];
  setMedicines: React.Dispatch<React.SetStateAction<MedicinesType[]>>;
  setSideEffect: () => void;
}

const DetailModal = ({
  openDetailModal,
  setOpenDetailModal,
  events,
  setEvents,
  values,
  setValues,
  medicines,
  setMedicines,
  setSideEffect,
}: Props) => {
  const [viewEvents, setViewEvents] = useState<boolean>(false);

  const { user } = useAuthStore();

  useEffect(() => {
    setViewMedicines({ events, values, setValues, setViewEvents });
  }, [values.start_date, values.medi_time]);

  // 같은 날짜의 데이터가 이미 있는 경우, id 일치 시키기
  useEffect(() => {
    let dateFilteredEvent = events.filter((event: EventInput) => {
      let event_date = new Date(
        new Date(String(event.start)).getTime() + DATE_OFFSET
      )
        .toISOString()
        .split("T")[0];

      return event_date === values.start_date;
    });

    if (dateFilteredEvent.length !== 0) {
      let event_id = dateFilteredEvent[0].groupId as string;

      setValues((prev) => {
        return { ...prev, id: event_id };
      });
    }

    if (dateFilteredEvent.length === 0) {
      setValues((prev) => {
        return { ...prev, id: uuid() };
      });
    }

    if (user) {
      setSideEffect();
    }
  }, [values.start_date]);

  // modal 닫기 버튼 onClick 함수
  const handleCloseButtonClick = () => {
    setOpenDetailModal(false);
    setValues({
      ...values,
      medi_time: "morning",
      medicine_id: [],
      side_effect: "",
      start_date: new Date(new Date().getTime() + DATE_OFFSET)
        .toISOString()
        .split("T")[0],
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

  // Route Handler 통해서 DELETE 하는 함수
  const deleteCalendar = async (id: string) => {
    try {
      const res = await axios.delete(`/api/calendar/${id}`);

      let deletedEvents = events.filter((event) => {
        return (
          String(event.start).split(" ")[0] !==
          new Date(new Date(values.start_date).getTime() + DATE_OFFSET)
            .toISOString()
            .split("T")[0]
        );
      });

      setEvents(deletedEvents);

      return res;
    } catch (error) {
      console.log("Delete Error", error);
    }
  };

  // 수정하기 버튼 onClick 함수
  const handlePostButtonClick = () => {
    if (values.medicine_id.length === 0) {
      alert("복용하신 약을 체크해주세요!");
      return;
    }

    postCalendar(values);
    setOpenDetailModal(false);
    setValues({
      ...values,
      medi_time: "morning",
      medicine_id: [],
      side_effect: "",
      start_date: new Date(new Date().getTime() + DATE_OFFSET)
        .toISOString()
        .split("T")[0],
    });
  };

  // 삭제하기 버튼 onClick 함수
  const handleDeleteButtonClick = () => {
    if (confirm(`${values.start_date}의 기록을 모두 삭제하시겠습니까 ? `)) {
      deleteCalendar(values.id);

      setOpenDetailModal(false);
      setValues({
        ...values,
        medi_time: "morning",
        medicine_id: [],
        side_effect: "",
        start_date: new Date(new Date().getTime() + DATE_OFFSET)
          .toISOString()
          .split("T")[0],
      });
    }
  };

  return (
    <Modal
      isOpen={openDetailModal}
      onRequestClose={handleCloseButtonClick}
      className="fixed h-screen inset-0 flex items-center justify-items-center max-[414px]:hidden "
      overlayClassName="fixed inset-0 bg-black/[0.6] z-10 max-[414px]:hidden "
      ariaHideApp={false}
    >
      <div className="w-1/4 min-w-96 h-5/8 min-h-[480px] p-6 my-0 mx-auto flex flex-col gap-4 bg-white rounded-sm z-20 drop-shadow-xl ">
        <div className="flex align-items py-1 justify-between gap-2">
          <ModalTitle>하루 약 기록</ModalTitle>
          <ModalCloseButton handleCloseButtonClick={handleCloseButtonClick} />
        </div>
        <input
          type="date"
          name="start_date"
          value={values.start_date}
          onChange={(event) => handleContentChange(event, setValues)}
          className="px-24 py-1 text-md text-brand-gray-800 border border-brand-gray-200 outline-none rounded-sm"
        />
        <ModalInner
          values={values}
          setValues={setValues}
          medicines={medicines}
          setMedicines={setMedicines}
        />
        <div className="w-full h-1/5 py-4 flex items-center justify-center gap-4">
          <ModalButton
            handleClick={handleDeleteButtonClick}
            viewEvents={viewEvents}
          >
            삭제
          </ModalButton>
          <ModalButton handleClick={handlePostButtonClick}>저장</ModalButton>
        </div>
      </div>
    </Modal>
  );
};

export default DetailModal;
