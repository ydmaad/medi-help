"use client";
import { NAME_OF_TIME } from "@/constant/constant";
import { MedicinesType, ValueType } from "@/types/calendar";
import { setViewMedicines } from "@/utils/calendar/calendarFunc";
import { EventInput } from "@fullcalendar/core";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  events: EventInput[];
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
  medicine: MedicinesType;
}

const PillComponent: React.FC<Props> = ({
  values,
  setValues,
  medicine,
  events,
}: Props) => {
  const [checked, setChecked] = useState<boolean>();
  const [mediTimes, setMediTimes] = useState<string[]>([]);
  const [viewEvents, setViewEvents] = useState<boolean>(false);
  const { id, time, name } = medicine;

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
    setViewMedicines({ events, values, setValues, setViewEvents });
  }, [values.start_date, values.medi_time]);

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
              checked ? "bg-[#BCE1FD]" : "bg-[#E0E2E4]"
            } inline-block mr-1`}
          />
          {NAME_OF_TIME[values.medi_time]}
          <span
            className={checked ? "text-[#279EF9] ml-1" : "text-[#7C7F86] ml-1"}
          >
            {`오후 12:00`}
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
