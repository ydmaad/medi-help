"use client";
import ModalButton from "@/components/atoms/ModalButton";
import ModalCloseButton from "@/components/atoms/ModalCloseButton";
import ModalTitle from "@/components/atoms/ModalTitle";
import ModalInner from "@/components/molecules/ModalInner";
import { ValueType } from "@/types/calendar";
import { EventInput } from "@fullcalendar/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import uuid from "react-uuid";

interface Props {
  openDetailModal: boolean;
  setOpenDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
  editEvents: EventInput[];
}

const DetailModal = ({
  openDetailModal,
  setOpenDetailModal,
  editEvents,
}: Props) => {
  const [values, setValues] = useState<ValueType>({
    id: uuid(),
    user_id: "",
    medi_time: "morning",
    medicine_id: [],
    side_effect: "",
    start_date: new Date(),
  });

  useEffect(() => {
    setViewEvents();
  }, [editEvents, values.medi_time]);

  // meditime 필터링 추가 + sideEffect set 로직 추가
  const setViewEvents = () => {
    if (editEvents.length !== 0) {
      let filteredMedicines;
      let viewMedicines = editEvents[0].extendProps.medicineList.map(
        (medicine: any) => medicine.medications.id
      );
      console.log(editEvents[0]);
      setValues({ ...values, medicine_id: viewMedicines });
    }
  };

  // modal 닫기 버튼 onClick 함수
  const handleCloseButtonClick = () => {
    setOpenDetailModal(false);
    setValues({
      ...values,
      medi_time: "morning",
      medicine_id: [],
      side_effect: "",
      start_date: new Date(),
    });
  };

  // Route Handler 통해서 UPDATE 하는 함수
  const updateCalendar = async (id: string, value: test_calendar) => {
    try {
      const res = await axios.patch(`/api/calendar/${id}`, value);
      console.log(res);
      return res;
    } catch (error) {
      console.log("Patch Error", error);
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
  // const handleUpdateButtonClick = () => {
  //   updateCalendar(calendarId, values);
  //   setOpenModal(false);
  // };

  // 삭제하기 버튼 onClick 함수
  // const handleDeleteButtonClick = () => {
  //   deleteCalendar(calendarId);
  //   setOpenModal(false);
  // };

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
        <ModalInner values={values} setValues={setValues} />
        <div className="w-full h-1/5 py-4 flex items-center justify-center gap-4">
          <ModalButton handleClick={() => {}}>삭제</ModalButton>
          <ModalButton handleClick={() => {}}>저장</ModalButton>
        </div>
      </div>
    </Modal>
  );
};

export default DetailModal;
