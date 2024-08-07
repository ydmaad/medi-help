"use client";

import ModalButton from "@/components/atoms/ModalButton";
import ModalCloseButton from "@/components/atoms/ModalCloseButton";
import ModalTitle from "@/components/atoms/ModalTitle";
import ModalInner from "@/components/molecules/ModalInner";
import { COLOR_OF_TIME, DATE_OFFSET, TIME_OF_TIME } from "@/constant/constant";
import { useAuthStore } from "@/store/auth";
import { ValueType } from "@/types/calendar";
import { EventInput } from "@fullcalendar/core";
import axios from "axios";
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
}

const DetailModal = ({
  openDetailModal,
  setOpenDetailModal,
  events,
  setEvents,
  values,
  setValues,
}: Props) => {
  const [viewEvents, setViewEvents] = useState<boolean>(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      setValues((prev) => {
        return { ...prev, user_id: user.id };
      });
    }
  }, [user]);

  useEffect(() => {
    setViewValues();
  }, [values.start_date, values.medi_time]);

  // input 창에 value Set.
  const setViewValues = () => {
    let editList = events.filter((event) => {
      return event.start?.toString().split(" ")[0] === values.start_date;
    });

    if (editList.length !== 0) {
      setViewEvents(true);
      let viewEvent = editList.filter((event: any) => {
        return values.medi_time === event.extendProps.medi_time;
      })[0];
      if (viewEvent) {
        setValues({
          ...values,
          medicine_id: viewEvent.extendProps.medicineList,
          side_effect: editList[0].extendProps.sideEffect,
        });
      }
    }

    if (editList.length === 0) {
      setViewEvents(false);
      setValues({
        ...values,
        medicine_id: [],
        side_effect: "",
      });
    }
  };

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
  }, [values.start_date]);

  // side_effect 입력란 onChange 함수
  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

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
            sideEffect: value.side_effect,
            medi_time: value.medi_time,
            medicineList: value.medicine_id,
          },
        },
      ]);
      return data;
    } catch (error) {
      console.log("Post Error", error);
    }
  };

  // Route Handler 통해서 DELETE 하는 함수
  const deleteCalendar = async (id: string) => {
    try {
      const res = await axios.delete(`/api/calendar/${id}`);
      console.log(res);
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

      let deletedEvents = events.filter((event) => {
        return (
          String(event.start).split(" ")[0] !==
          new Date(new Date(values.start_date).getTime() + DATE_OFFSET)
            .toISOString()
            .split("T")[0]
        );
      });

      setEvents(deletedEvents);
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
      className="fixed h-screen inset-0 flex items-center justify-items-center "
      overlayClassName="fixed inset-0 bg-black/[0.6] z-10"
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
          onChange={handleContentChange}
          className="px-24 py-1 text-md text-brand-gray-800 border border-brand-gray-200 outline-none rounded-sm"
        />
        <ModalInner values={values} setValues={setValues} />
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
