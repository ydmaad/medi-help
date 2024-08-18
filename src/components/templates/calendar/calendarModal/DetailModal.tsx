"use client";

import ModalButton from "@/components/atoms/ModalButton";
import ModalCloseButton from "@/components/atoms/ModalCloseButton";
import ModalTitle from "@/components/atoms/ModalTitle";
import EditModalInner from "@/components/molecules/EditModalInner";
import ViewModalInner from "@/components/molecules/ViewModalInner";
import { COLOR_OF_TIME, DATE_OFFSET, TIME_OF_TIME } from "@/constants/constant";
import {
  useCalendarStore,
  useEditStore,
  useEventsStore,
  useValuesStore,
} from "@/store/calendar";
import { ValuesType } from "@/types/calendar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useToast } from "@/hooks/useToast";
import { Tables } from "@/types/supabase";

type CalendarType = Tables<"calendar">;

interface Props {
  openDetailModal: boolean;
  setOpenDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
  viewEvents: boolean;
  setViewEvents: React.Dispatch<React.SetStateAction<boolean>>;
}

const DetailModal = ({
  viewEvents,
  setViewEvents,
  openDetailModal,
  setOpenDetailModal,
}: Props) => {
  const { values, setValues } = useValuesStore();
  const { calendar, setCalendar } = useCalendarStore();
  const { events, setEvents } = useEventsStore();
  const { edit, setEdit } = useEditStore();

  const { toast } = useToast();

  // modal 닫기 버튼 onClick 함수
  const handleCloseButtonClick = () => {
    setOpenDetailModal(false);
    let deletedCalendar: CalendarType[] = calendar.filter(
      (data) => data.start_date !== values.start_date
    );
    setCalendar(deletedCalendar);
    setEdit(false);
    setValues({
      ...values,
      medi_time: "morning",
      medicine_id: [],
      side_effect: "",
      start_date: "",
    });
  };

  // Route Handler 통해서 POST 하는 함수
  const postCalendar = async (value: ValuesType) => {
    try {
      const { data } = await axios.post(`/api/calendar`, value);

      let countMedicines = value.medicine_id.length;

      if (countMedicines === 0) {
        setEvents([
          ...events.filter((event) => {
            return !(
              event.groupId === value.id &&
              event.extendProps.medi_time === value.medi_time
            );
          }),
        ]);
      }

      if (countMedicines !== 0) {
        let medicineNickname = data[0][0].medications.medi_nickname;
        setEvents([
          ...events.filter((event) => {
            return !(
              event.groupId === value.id &&
              event.extendProps.medi_time === value.medi_time
            );
          }),
          {
            groupId: value.id,
            title:
              countMedicines !== 1
                ? `${medicineNickname} 외 ${countMedicines - 1}개`
                : `${medicineNickname}`,
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

      setCalendar([
        ...calendar.filter((cal) => cal.id !== value.id),
        { ...value, created_at: String(new Date()) },
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

      setEvents([
        ...events.filter((event) => {
          return (
            String(event.start).split(" ")[0] !==
            new Date(new Date(values.start_date).getTime() + DATE_OFFSET)
              .toISOString()
              .split("T")[0]
          );
        }),
      ]);

      setCalendar([...calendar.filter((cal) => cal.id !== id)]);

      return res;
    } catch (error) {
      console.log("Delete Error", error);
    }
  };

  // 저장하기 버튼 onClick 함수
  const handlePostButtonClick = async () => {
    if (values.side_effect?.trim() === "" && values.medicine_id.length === 0) {
      toast.warning("복용하신 약이나 노트를 입력해주세요 !");
      return;
    }

    setValues({
      ...values,
      side_effect: values.side_effect ? values.side_effect.trim() : "",
    });

    postCalendar(values);

    toast.success("복용 기록이 저장되었습니다.");

    setOpenDetailModal(false);
    setEdit(false);
    setValues({
      ...values,
      medi_time: "morning",
      medicine_id: [],
      side_effect: "",
      start_date: "",
    });
  };

  // 삭제하기 버튼 onClick 함수
  const handleDeleteButtonClick = () => {
    if (confirm(`${values.start_date}의 기록을 모두 삭제하시겠습니까 ? `)) {
      deleteCalendar(values.id);

      toast.success("선택하신 날짜의 복용 기록이 삭제되었습니다.");

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

  // 수정하기 버튼 onClick 함수
  const handleEditButtonClick = () => {
    setEdit(true);
  };

  return (
    <Modal
      isOpen={openDetailModal}
      onRequestClose={handleCloseButtonClick}
      className="fixed h-screen inset-0 m-20 hidden desktop:block outline-none "
      overlayClassName="fixed inset-0 bg-black/[0.6] z-20 hidden desktop:block "
      ariaHideApp={false}
    >
      <div className="w-1/4 min-w-96 h-5/8 min-h-[480px] p-6 my-0 m-auto flex flex-col gap-[20px] bg-white rounded-sm z-20 drop-shadow-xl ">
        <div className="flex align-items py-1 justify-between gap-2">
          <ModalTitle>하루 약 기록</ModalTitle>
          <ModalCloseButton handleCloseButtonClick={handleCloseButtonClick} />
        </div>

        {edit ? (
          <>
            <EditModalInner
              viewEvents={viewEvents}
              setViewEvents={setViewEvents}
            />
            <div className="w-full h-1/5 py-4 flex items-center justify-center gap-4">
              <ModalButton
                handleClick={handleDeleteButtonClick}
                viewEvents={viewEvents}
              >
                삭제
              </ModalButton>
              <ModalButton handleClick={handlePostButtonClick}>
                저장
              </ModalButton>
            </div>
          </>
        ) : (
          <>
            <ViewModalInner />
            <div className="w-full h-1/5 py-4 flex items-center justify-center gap-4">
              <ModalButton handleClick={handleEditButtonClick}>
                수정
              </ModalButton>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DetailModal;
