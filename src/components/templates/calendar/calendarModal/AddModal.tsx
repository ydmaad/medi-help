"use client";
import React, { useEffect, useState } from "react";
import ModalTitle from "@/components/atoms/calendar/ModalTitle";
import ModalCloseButton from "@/components/atoms/calendar/ModalCloseButton";
import SemiTitle from "@/components/atoms/calendar/SemiTitle";
import MediCheck from "@/components/atoms/calendar/MediCheck";
import { ValueType } from "@/types/calendar_values";
import axios from "axios";

type MedicinesType = {
  name: string;
  isChecked: boolean;
};
interface Props {
  openAddModal: boolean;
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddModal = ({ openAddModal, setOpenAddModal }: Props) => {
  const [values, setValues] = useState<ValueType>({
    user_id: "test@test.com",
    medi_time: "",
    medi_name: [],
    sideEffect: "",
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
                isChecked: false,
              },
            ];
          });
        });
      } catch (error) {
        console.log("medi axios =>", error);
      }
    };

    getMedicines();
    console.log(medicines);
  }, []);

  const handleCloseButtonClick = () => {
    setOpenAddModal(false);
    return;
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
        <div className="flex align-items py-1 gap-2 text-xs text-gray-400">
          <div className="w-[34px] h-[34px] flex justify-center items-center rounded-full bg-blue-200 text-blue-800 ">
            아침
          </div>
          <div className="w-[34px] h-[34px] flex justify-center items-center bg-blue-200 text-blue-800 rounded-full">
            점심
          </div>
          <div className="w-[34px] h-[34px] flex justify-center items-center bg-blue-200 text-blue-800 rounded-full">
            저녁
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {medicines.map((medicine: MedicinesType, idx: number) => {
            if (medicine) {
              return (
                <MediCheck
                  medicines={medicines}
                  setMedicines={SetMedicines}
                  name={medicine.name}
                  idx={idx}
                  key={medicine.name}
                />
              );
            }
          })}
        </div>
        <div>노트</div>
        <textarea
          name="sideEffect"
          id="sideEffect"
          placeholder="간단한 약 메모"
          className="h-1/4 p-1 border border-gray-500 outline-none rounded-sm"
        ></textarea>
        <div className="w-full h-1/5 flex items-center justify-center">
          <button className="w-24 h-10 bg-blue-500 rounded-md text-white">
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
