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
  const [showAllMedicines, setShowAllMedicines] = useState<boolean>(false);

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
    <>
      {/* '복약 달력'을 div 밖으로 빼서 상단에 배치 */}
      <div className="flex items-center mt-12">
        <img src="/pencil.png" alt="연필 아이콘" className="w-8 h-8 mr-2" />
        <h1 className="text-[32px] text-brand-gray-1000 font-bold">
          복약 달력
        </h1>
      </div>
      <div className="h-full flex flex-col overflow-y-auto">
        <div className="ml-4">
          <h2 className="text-brand-gray-600 text-lg mt-6 mb-2">복용 약 필터</h2>
          <div
            className={`${
              showAllMedicines ? "max-h-full" : "max-h-32"
            } overflow-y-auto transition-max-height duration-300`}
          >
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
                          ? "bg-brand-gray-600 border-brand-gray-600"
                          : "bg-brand-gray-50 border-brand-gray-50"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 ${
                          selectedMedicines.includes(medicine.id)
                            ? "text-brand-gray-50"
                            : "text-brand-gray-200"
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
                          ? "text-brand-gray-800"
                          : "text-brand-gray-400"
                      }`}
                    >
                      {medicine.medi_nickname}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          {/* 아이콘을 추가하여 목록을 확장/축소하는 버튼 */}
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setShowAllMedicines((prev) => !prev)}
              className="text-brand-gray-200 focus:outline-none"
            >
              {showAllMedicines ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 15l-7-7-7 7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 9l7 7 7-7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarCheckbox;
