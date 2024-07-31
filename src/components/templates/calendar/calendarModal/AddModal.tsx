"use client";
import React, { useEffect, useState } from "react";
import ModalTitle from "@/components/atoms/ModalTitle";
import ModalCloseButton from "@/components/atoms/ModalCloseButton";
import SemiTitle from "@/components/atoms/SemiTitle";
import MediCheck from "@/components/atoms/MediCheck";
import { ValueType, MedicinesType, EventsType } from "@/types/calendar";
import axios from "axios";
import ModalFilterButton from "@/components/atoms/ModalFilterButton";
import { COLOR_OF_TIME } from "@/constant/constant";
import ModalButton from "@/components/atoms/ModalButton";

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

  const [medicines, SetMedicines] = useState<MedicinesType[]>([]);

  useEffect(() => {
    const getMedicines = async () => {
      try {
        const { data } = await axios.get("/api/calendar/medi");
        console.log(data);
        data.medicationRecords.map((record: any) => {
          SetMedicines((prev) => {
            return [
              ...prev,
              {
                name: record.medi_nickname,
                time: record.times,
              },
            ];
          });
        });
      } catch (error) {
        console.log("medi axios =>", error);
      }
    };

    getMedicines();
  }, []);

  // side_effect 입력란 onChange 함수
  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  // modal 닫기 버튼 onClick 함수
  const handleCloseButtonClick = () => {
    setOpenAddModal(false);
  };

  // time Category onClick 함수
  const handleTimeClick = (time: string) => {
    console.log(time);
    setValues((prev) => {
      return { ...prev, medi_name: [], medi_time: time };
    });
  };

  // 저장 버튼 onClick 함수
  const handleSubmitClick = () => {
    const postCalendar = async (value: ValueType) => {
      try {
        const res = await axios.post("/api/calendar", value);

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
      postCalendar(values);
      setValues({
        medi_time: "morning",
        medi_name: [],
        side_effect: "",
        start_date: null,
      });
    }
  };

  return (
    <div
      className={`absolute w-3/4 h-full min-h-screen bg-black/[0.6] pt-32 flex justify-center z-10 backdrop-blur-sm ${
        openAddModal ? "block" : "hidden"
      }`}
    >
      <div className="sticky w-1/4 min-w-96 h-3/4 p-6 my-0 mx-auto flex flex-col gap-4 bg-white rounded-sm z-20 drop-shadow-xl ">
        <div className="flex align-items py-1 justify-between gap-2">
          <ModalTitle>하루 약 기록</ModalTitle>
          <ModalCloseButton handleCloseButtonClick={handleCloseButtonClick} />
        </div>
        <div className="flex align-items gap-2 text-xs text-gray-400">
          <ModalFilterButton
            values={values}
            handleTimeClick={handleTimeClick}
            time={"morning"}
          >
            아침
          </ModalFilterButton>
          <ModalFilterButton
            values={values}
            handleTimeClick={handleTimeClick}
            time={"afternoon"}
          >
            점심
          </ModalFilterButton>
          <ModalFilterButton
            values={values}
            handleTimeClick={handleTimeClick}
            time={"evening"}
          >
            저녁
          </ModalFilterButton>
        </div>
        <div className="w-full h-44 grid grid-cols-2 gap-2 overflow-y-auto">
          {medicines
            .filter((medi: MedicinesType) => {
              return medi.time[values.medi_time] === true;
            })
            .map((medicine: MedicinesType, idx: number) => {
              return (
                <MediCheck
                  values={values}
                  setValues={setValues}
                  name={medicine.name}
                  time={medicine.time}
                  idx={idx}
                  key={idx}
                />
              );
            })}
        </div>
        <SemiTitle>노트</SemiTitle>
        <textarea
          name="side_effect"
          value={values.side_effect}
          onChange={handleContentChange}
          placeholder="간단한 약 메모"
          className="h-1/4 p-1 border border-gray-500 outline-none rounded-sm"
        ></textarea>
        <div className="w-full h-1/5 flex items-center justify-center">
          <ModalButton handleSubmitClick={handleSubmitClick}>저장</ModalButton>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
