"use client";
import React, { useEffect, useState } from "react";
import ModalTitle from "@/components/atoms/calendar/ModalTitle";
import ModalCloseButton from "@/components/atoms/calendar/ModalCloseButton";
import SemiTitle from "@/components/atoms/calendar/SemiTitle";
import MediCheck from "@/components/atoms/calendar/MediCheck";
import { ValueType } from "@/types/calendar_values";
import axios from "axios";
import ModalFilterButton from "@/components/atoms/calendar/ModalFilterButton";

type MedicinesType = {
  name: string;
  isChecked: boolean;
  time: { [key: string]: boolean };
};
interface Props {
  openAddModal: boolean;
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddModal = ({ openAddModal, setOpenAddModal }: Props) => {
  const [values, setValues] = useState<ValueType>({
    medi_time: "morning",
    medi_name: [],
    side_effect: "",
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
  }, []);

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleCloseButtonClick = () => {
    setOpenAddModal(false);
    return;
  };

  const handleTimeClick = (time: string) => {
    console.log(time);
    setValues((prev) => {
      return { ...prev, medi_name: [], medi_time: time };
    });
  };

  const handleSubmitClick = () => {
    const postCalendar = async (value: ValueType) => {
      try {
        const res = await axios.post("/api/calendar", value);
        console.log(res);
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
          <button
            onClick={handleSubmitClick}
            className="w-24 h-10 bg-blue-500 rounded-md text-white"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
