import ModalButton from "@/components/atoms/ModalButton";
import ModalCloseButton from "@/components/atoms/ModalCloseButton";
import ModalTitle from "@/components/atoms/ModalTitle";
import ModalInner from "@/components/molecules/ModalInner";
import { COLOR_OF_TIME } from "@/constant/constant";
import { EventsType, ValueType } from "@/types/calendar";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

interface Props {
  openDetailModal: boolean;
  setOpenDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
  editEvents: EventsType[];
}

const DetailModal = ({
  openDetailModal,
  setOpenDetailModal,
  editEvents,
}: Props) => {
  const [values, setValues] = useState<ValueType>({
    medi_time: "morning",
    medi_name: [],
    side_effect: "",
    start_date: new Date(),
  });

  useEffect(() => {
    setViewEvents();
  }, [editEvents]);

  useEffect(() => {
    setViewEvents();
  }, [values.medi_time]);

  const setViewEvents = () => {
    let viewEvents = editEvents.filter((event) => {
      let time = Object.keys(COLOR_OF_TIME).filter((timeName) => {
        return COLOR_OF_TIME[timeName] === event.backgroundColor;
      });
      console.log(time);
      return time[0] === values.medi_time;
    });
    console.log(viewEvents);

    viewEvents.map((event) => {
      setValues((prev) => {
        return { ...prev, medi_name: [...prev.medi_name, event.title] };
      });
    });
  };

  console.log(values);

  // modal 닫기 버튼 onClick 함수
  const handleCloseButtonClick = () => {
    setOpenDetailModal(false);
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
