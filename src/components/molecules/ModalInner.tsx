"use client";
import { useAuthStore } from "@/store/auth";
import { MedicinesType, ValueType } from "@/types/calendar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ModalFilterButton from "../atoms/ModalFilterButton";
import MediCheck from "../atoms/MediCheck";
import SemiTitle from "../atoms/SemiTitle";

interface Props {
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
}

const ModalInner = ({ values, setValues }: Props) => {
  const [medicines, SetMedicines] = useState<MedicinesType[]>([]);

  const { user } = useAuthStore();

  useEffect(() => {
    const getMedicines = async () => {
      try {
        if (user) {
          const { data } = await axios.get(
            `/api/calendar/medi?user_id=${user.id}`
          );
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
        }
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

  // time Category onClick 함수
  const handleTimeClick = (time: string) => {
    setValues((prev) => {
      return { ...prev, medi_name: [], medi_time: time };
    });
  };

  return (
    <>
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
      <div className="w-full h-32 min-h-32 grid grid-cols-2 gap-2 overflow-y-auto">
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
        className="h-2/5 min-h-20 p-1 border border-brand-gray-200 outline-none rounded-sm text-sm"
      ></textarea>
    </>
  );
};

export default ModalInner;
