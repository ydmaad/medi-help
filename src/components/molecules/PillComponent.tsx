"use client";
import { NAME_OF_TIME } from "@/constant/constant";
import { useValuesStore } from "@/store/calendar";
import { MedicinesType } from "@/types/calendar";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  medicine: MedicinesType;
}

const PillComponent: React.FC<Props> = ({ medicine }: Props) => {
  const [checked, setChecked] = useState<boolean>();
  const [mediTimes, setMediTimes] = useState<string[]>([]);
  const [notification, setNotification] = useState<string[]>([""]);
  const { id, time, name } = medicine;

  const { values, setValues } = useValuesStore();

  useEffect(() => {
    let timeOfMedicine = Object.keys(time).filter((times) => {
      return time[times] === true;
    });

    setMediTimes(
      timeOfMedicine.map((time) => {
        return NAME_OF_TIME[time];
      })
    );
  }, [time]);

  useEffect(() => {
    setChecked(values.medicine_id.includes(id));
  }, [values.medicine_id]);

  useEffect(() => {
    getNotificationTime();
  }, [values.start_date]);

  const getNotificationTime = () => {
    if (medicine.notification_time.length !== 0) {
      medicine.notification_time.map((time) => {
        let hour = time.split(":")[0];
        let minute = time.split(":")[1];
        if (Number(hour) === 0) {
          setNotification((prev) => [...prev, `오전 12:${minute}`]);
        }

        if (Number(hour) > 12) {
          setNotification((prev) => [
            ...prev,
            `오후 0${Number(hour) - 12}:${minute}`,
          ]);
        }

        if (Number(hour) > 0 && Number(hour) <= 12) {
          setNotification((prev) => [...prev, `오전 ${hour}:${minute}`]);
        }
      });
    }
  };

  return (
    <div
      className={`w-full h-14 flex py-2 px-2 rounded-[4px] ${
        checked ? "bg-[#E9F5FE]" : "bg-[#F5F6F7]"
      }`}
    >
      <Image
        src={checked ? "/pill-filled.svg" : "/pill-inactive.svg"}
        alt="pill"
        width={20}
        height={20}
        className=" w-auto mr-2"
      />
      <div className="flex flex-col gap-0.5 font-normal">
        <div
          className={`text-[12px] ${
            checked ? "text-[#7C7F86]" : "text-[#7C7F86]"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              checked ? "bg-[#bce1fd]" : "bg-[#E0E2E4]"
            } inline-block mr-1`}
          />
          {NAME_OF_TIME[values.medi_time]}
          <span
            className={checked ? "text-[#279EF9] ml-1" : "text-[#7C7F86] ml-1"}
          >
            {/* {notification[Object.keys(NAME_OF_TIME).indexOf(values.medi_time)]} */}
            {notification}
          </span>
        </div>
        <div
          className={`text-[14px] ${
            checked ? "" : "line-through text-[#7C7F86]"
          }`}
        >
          {name}
        </div>
      </div>
    </div>
  );
};

export default PillComponent;
