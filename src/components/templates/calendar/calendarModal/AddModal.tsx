"use client";
import React, { useEffect, useState } from "react";
import ModalTitle from "@/components/atoms/ModalTitle";
import ModalCloseButton from "@/components/atoms/ModalCloseButton";
import { ValueType } from "@/types/calendar";
import axios from "axios";
import { COLOR_OF_TIME, DATE_OFFSET, TIME_OF_TIME } from "@/constant/constant";
import ModalButton from "@/components/atoms/ModalButton";
import Modal from "react-modal";
import ModalInner from "@/components/molecules/ModalInner";
import { useAuthStore } from "@/store/auth";
import { EventInput } from "@fullcalendar/core";
import uuid from "react-uuid";

interface Props {
  openAddModal: boolean;
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  events: EventInput[];
  setEvents: React.Dispatch<React.SetStateAction<EventInput[]>>;
}
const AddModal = ({
  openAddModal,
  setOpenAddModal,
  events,
  setEvents,
}: Props) => {
  const { user } = useAuthStore();

  const [values, setValues] = useState<ValueType>({
    id: uuid(),
    user_id: "",
    medi_time: "morning",
    medicine_id: [],
    side_effect: "",
    start_date: new Date(new Date().getTime() + DATE_OFFSET)
      .toISOString()
      .split("T")[0],
  });

  useEffect(() => {
    if (user) {
      setValues((prev) => {
        return { ...prev, user_id: user.id };
      });
    }
  }, [user]);

  // 날짜가 바뀔 때 마다 실행하고 싶은데, 오늘 등록하는 경우에는.. 의존성 배열을 어떻게 줘야 될지 모르겠다.
  useEffect(() => {
    let dateFilteredEvent = events.filter((event: EventInput) => {
      let value_date = new Date(
        new Date(values.start_date).getTime() + DATE_OFFSET
      )
        .toISOString()
        .split("T")[0];
      let event_date = new Date(
        new Date(String(event.start)).getTime() + DATE_OFFSET
      )
        .toISOString()
        .split("T")[0];

      return event_date === value_date;
    });

    console.log(dateFilteredEvent);

    if (dateFilteredEvent.length !== 0) {
      let event_id = dateFilteredEvent[0].groupId as string;
      setValues((prev) => {
        return { ...prev, id: event_id };
      });
    }
  }, [values.medicine_id.length, values.start_date]);

  // modal 닫기 버튼 onClick 함수
  const handleCloseButtonClick = () => {
    setOpenAddModal(false);
  };

  // 저장 버튼 onClick 함수
  const handleSubmitClick = () => {
    const postCalendar = async (value: ValueType) => {
      try {
        const { data } = await axios.post("/api/calendar", value);

        setEvents((prev) => {
          return [
            ...prev,
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
          ];
        });
        return data;
      } catch (error) {
        console.log("Post Error", error);
      }
    };

    if (values.medicine_id.length !== 0) {
      postCalendar(values);
      setValues({
        ...values,
        id: "",
        medi_time: "morning",
        medicine_id: [],
        side_effect: "",
        start_date: new Date(new Date().getTime() + DATE_OFFSET)
          .toISOString()
          .split("T")[0],
      });
      setOpenAddModal(false);
    }
  };

  return (
    <Modal
      isOpen={openAddModal}
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
        <ModalInner values={values} setValues={setValues} />
        <div className="w-full h-1/5 py-4 flex items-center justify-center">
          <ModalButton handleClick={handleSubmitClick}>저장</ModalButton>
        </div>
      </div>
    </Modal>
  );
};

export default AddModal;
