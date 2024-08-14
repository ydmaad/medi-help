"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import axios from "axios";
import { Tables } from "@/types/supabase";
import { EventInput } from "@fullcalendar/core";
import {
  useEventsStore,
  useMedicinesStore,
  useMediNameFilter,
} from "@/store/calendar";

type MedicineType = Tables<"medications">;
type CalendarMedicineType = {
  id: string;
  medi_time: string;
  medications: MedicineType;
};

const CalendarCheckbox = () => {
  const { user } = useAuthStore();
  const { mediNames, setMediNames } = useMediNameFilter();
  const { events, setEvents } = useEventsStore();
  const [checkedMedicines, setCheckedMedicines] = useState<MedicineType[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);

  useEffect(() => {
    const fetchCheckedMedicines = async () => {
      if (user) {
        try {
          const { data } = await axios.get(`/api/calendar?user_id=${user.id}`);

          // 데이터를 가공하여 각 날짜별로 체크된 약들의 목록을 추출
          const allCheckedMedicines: MedicineType[] = [];
          data.forEach((event: EventInput) => {
            event.calendar_medicine.forEach(
              (medicine: CalendarMedicineType) => {
                allCheckedMedicines.push(medicine.medications);
              }
            );
          });

          setCheckedMedicines(allCheckedMedicines);
          setSelectedMedicines(
            allCheckedMedicines.map((medicine) => medicine.id)
          );
          setMediNames(
            allCheckedMedicines.map((medicine) => medicine.medi_nickname || "")
          );
        } catch (error) {
          console.log("Error fetching checked medicines", error);
        }
      }
    };

    fetchCheckedMedicines();
  }, [user]);

  const handleCheckboxChange = (medicine: MedicineType) => {
    setSelectedMedicines((prev) =>
      prev.includes(medicine.id)
        ? prev.filter((id) => id !== medicine.id)
        : [...prev, medicine.id]
    );
    setMediNames(
      mediNames.includes(medicine.medi_nickname)
        ? mediNames.filter(
            (medi_nickname) => medi_nickname !== medicine.medi_nickname
          )
        : [...mediNames, medicine.medi_nickname]
    );
  };

  let nonAllowedDuplicates: MedicineType[] = [];
  checkedMedicines.forEach((medicine) => {
    if (
      !nonAllowedDuplicates.find(
        (e) => e.medi_nickname === medicine.medi_nickname
      )
    ) {
      nonAllowedDuplicates.push(medicine);
    }
  });

  return (
    <div className="h-full flex flex-col mt-12 overflow-y-auto">
      <h1 className="text-[32px] text-brand-gray-1000 font-bold mb-[20px] flex items-center">
        <img src="/pencil.png" alt="연필 아이콘" className="w-8 h-8 mr-2" />
        복약 달력
      </h1>
      <div className="ml-4">
        <h2 className="text-gray-600 text-lg mb-2">복용 약 필터</h2>
        <div className="max-h-32 overflow-y-auto">
          <ul>
            {nonAllowedDuplicates.map((medicine) => (
              <li key={medicine.id} className="flex items-center mb-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedMedicines.includes(medicine.id)}
                    onChange={() => handleCheckboxChange(medicine)}
                  />
                  <div
                    className={`w-5 h-5 flex items-center justify-center border rounded ${
                      selectedMedicines.includes(medicine.id)
                        ? "bg-gray-600 border-gray-600"
                        : "bg-gray-50 border-gray-50"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 ${
                        selectedMedicines.includes(medicine.id)
                          ? "text-gray-50"
                          : "text-gray-200"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span
                    className={`ml-3 text-lg ${
                      selectedMedicines.includes(medicine.id)
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    {medicine.medi_nickname}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalendarCheckbox;