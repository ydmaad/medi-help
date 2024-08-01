"use client";
import React, { useState } from "react";
import ModalTitle from "@/components/atoms/ModalTitle";
import ModalCloseButton from "@/components/atoms/ModalCloseButton";
import { ValueType, EventsType } from "@/types/calendar";
import axios from "axios";
import { COLOR_OF_TIME } from "@/constant/constant";
import ModalButton from "@/components/atoms/ModalButton";
import Modal from "react-modal";
import ModalInner from "@/components/molecules/ModalInner";

interface Props {
  openAddModal: boolean;
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEvents: React.Dispatch<React.SetStateAction<EventsType[]>>;
}
const AddModal = ({ openAddModal, setOpenAddModal, setEvents }: Props) => {
  const [values, setValues] = useState<ValueType>({
    medi_time: "morning",
    medi_name: [],
    side_effect: "",
    start_date: new Date(),
  });

  // modal 닫기 버튼 onClick 함수
  const handleCloseButtonClick = () => {
    setOpenAddModal(false);
  };

  // 저장 버튼 onClick 함수
  const handleSubmitClick = () => {
    const postCalendar = async (value: ValueType) => {
      try {
        const res = await axios.post("/api/calendar", value);
        console.log(res);

        value.medi_name.map((name: string) => {
          setEvents((prev) => {
            return [
              ...prev,
              {
                title: name,
                start: value.start_date,
                backgroundColor: COLOR_OF_TIME[value.medi_time],
                borderColor: COLOR_OF_TIME[value.medi_time],
                textColor: "white",
              },
            ];
          });
        });
        return res;
      } catch (error) {
        console.log("Post Error", error);
      }
    };

    if (values.medi_name.length !== 0) {
      console.log("가랏!");
      console.log(values);
      postCalendar(values);
      setValues({
        medi_time: "morning",
        medi_name: [],
        side_effect: "",
        start_date: new Date(),
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
