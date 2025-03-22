"use client";

import ModalButton from "@/components/atoms/ModalButton";
import ModalCloseButton from "@/components/atoms/ModalCloseButton";
import ModalTitle from "@/components/atoms/ModalTitle";
import EditModalInner from "@/components/molecules/EditModalInner";
import ViewModalInner from "@/components/molecules/ViewModalInner";
import { DATE_OFFSET, TIME_OF_TIME } from "@/constants/constant";
import {
  useCalendarStore,
  useEventsStore,
  useValuesStore,
} from "@/store/calendar";
import { ValuesType } from "@/types/calendar";
import axios from "axios";
import React, { useState } from "react";
import Modal from "react-modal";
import { useToast } from "@/hooks/useToast";
import { Tables } from "@/types/supabase";
import uuid from "react-uuid";

type CalendarType = Tables<"calendar">;

interface Props {
  openDetailModal: boolean;
  setOpenDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
  hasEvents: boolean;
  setHasEvents: React.Dispatch<React.SetStateAction<boolean>>;
}

const DetailModal = ({
  hasEvents,
  setHasEvents,
  openDetailModal,
  setOpenDetailModal,
}: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { values, setValues } = useValuesStore();
  const { calendar, setCalendar } = useCalendarStore();
  const { events, setEvents } = useEventsStore();

  const { toast } = useToast();

  // modal 닫기 버튼 onClick 함수
  const handleCloseButtonClick = () => {
    setOpenDetailModal(false);

    setIsEdit(false);
    setValues({
      ...values,
      medi_time: "morning",
      medicine_id: [],
      side_effect: "",
      start_date: "",
    });
  };

  // Route Handler 통해서 POST 하는 함수
  const postCalendar = async (value: any) => {
    try {
      const { data } = await axios.post(`api/calendar`, value);

      const [calendarData, _] = data[0];

      setCalendar([...calendar, calendarData]);

      if (data.length > 1) {
        const bridgeData = data[1];
        const countMedicines = value.medicine_id.length;
        const medicineNickname = bridgeData[0].medications.medi_nickname;

        if (!countMedicines) return;

        setEvents([
          ...events,
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
            extendProps: {
              medi_time: value.medi_time,
              medicineList: value.medicine_id,
            },
          },
        ]);
      }

      return data;
    } catch (error) {
      console.error("Post Error", error);
    }
  };

  // Route Handler 통해서 UPDATE 하는 함수
  const updateCalendar = async (id: string, value: ValuesType) => {
    try {
      const { data } = await axios.put(`/api/calendar/${id}`, value);

      const [calendarData, _] = data[0];
      setCalendar([
        ...calendar.filter((cal: any) => cal.id !== value.id),
        {
          ...value,
          created_at: calendarData.created_at,
          side_effect: calendarData.side_effect,
        },
      ]);

      const countMedicines = value.medicine_id.length;

      const filteredEvents = [
        ...events.filter((event: any) => {
          return !(
            event.groupId === value.id &&
            event.extendProps.medi_time === value.medi_time
          );
        }),
      ];

      if (!countMedicines) setEvents(filteredEvents);

      if (data.length > 1) {
        const bridgeData = data[1];

        const medicineNickname = bridgeData[0].medications.medi_nickname;
        setEvents([
          ...filteredEvents,
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
            extendProps: {
              medi_time: value.medi_time,
              medicineList: value.medicine_id,
            },
          },
        ]);
      }

      return data;
    } catch (error) {
      console.log("Update Error", error);
    }
  };

  // Route Handler 통해서 DELETE 하는 함수
  const deleteCalendar = async (id: string) => {
    try {
      const res = await axios.delete(`/api/calendar/${id}`);

      setEvents([
        ...events.filter((event: any) => {
          return (
            String(event.start).split(" ")[0] !==
            new Date(new Date(values.start_date).getTime() + DATE_OFFSET)
              .toISOString()
              .split("T")[0]
          );
        }),
      ]);

      setCalendar([...calendar.filter((cal: any) => cal.id !== id)]);

      return res;
    } catch (error) {
      console.log("Delete Error", error);
    }
  };

  // 저장하기 버튼 onClick 함수
  const handlePostButtonClick = async () => {
    if (values.medicine_id.length === 0 && !values.side_effect) {
      toast.error("복용 기록을 입력해주세요 !");
      return;
    }

    setValues({
      ...values,
      side_effect: values.side_effect?.length ? values.side_effect.trim() : "",
    });

    if (hasEvents) updateCalendar(values.id, values);
    if (!hasEvents) postCalendar(values);

    toast.success("복용 기록이 저장되었습니다.");

    setOpenDetailModal(false);
    setIsEdit(false);
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

      setIsEdit(false);
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
    const filteredCalendar = calendar.filter((cal: any) => {
      return cal.start_date === values.start_date;
    });

    setValues({
      ...values,
      id: filteredCalendar.length > 0 ? filteredCalendar[0].id : uuid(),
    });

    setIsEdit(true);
  };

  return (
    <Modal
      isOpen={openDetailModal}
      onRequestClose={handleCloseButtonClick}
      className="fixed h-screen inset-0 m-20 outline-none "
      overlayClassName="fixed inset-0 bg-black/[0.6] z-20 "
      ariaHideApp={false}
    >
      <div className="w-[416px] h-[579px] p-[24px] my-0 m-auto flex flex-col bg-white rounded-[8px] z-20 drop-shadow-xl ">
        <div className="flex align-items justify-between gap-2 mb-[20px]">
          <ModalTitle>하루 약 기록</ModalTitle>
          <ModalCloseButton handleCloseButtonClick={handleCloseButtonClick} />
        </div>

        {isEdit ? (
          <>
            <EditModalInner setHasEvents={setHasEvents} />
            <div className="w-full h-1/5 mt-[40px] flex items-center justify-center gap-4">
              <ModalButton
                handleClick={handleDeleteButtonClick}
                hasEvents={hasEvents}
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
            <div className="w-full mt-[40px] flex justify-center gap-4">
              <ModalButton handleClick={handleEditButtonClick}>
                {hasEvents ? "수정" : "등록"}
              </ModalButton>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DetailModal;
