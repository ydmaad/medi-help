"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth";
import axios from "axios";
import { Tables } from "@/types/supabase";
import { EventInput } from "@fullcalendar/core";
import {
  useEventsStore,
  useMedicinesStore,
  useMediNameFilter,
} from "@/store/calendar";
import CalendarTitle from "@/components/molecules/CalendarTitle";
import Modal from "react-modal";

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
  const [showFilterBox, setShowFilterBox] = useState<boolean>(false);

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
    <div className="mr-4">
      <CalendarTitle
        showFilterBox={showFilterBox}
        setShowFilterBox={setShowFilterBox}
      />
      {/* mobile filter box 부분 */}
      <Modal
        isOpen={showFilterBox}
        onRequestClose={() => setShowFilterBox(false)}
        className="fixed w-full min-h-[400px] mx-auto bg-white rounded-t-[12px] bottom-0 right-0 left-0 drop-shadow-lg desktop:hidden outline-none px-8 overflow-y-auto "
        overlayClassName="fixed inset-0 bg-black/[0.3] z-20 desktop:hidden "
        ariaHideApp={false}
      >
        <div className="bg-brand-gray-400 w-16 h-1 rounded-md mx-auto mt-4" />
        <h2 className="text-[18px] text-brand-gray-800 font-black desktop:font-normal desktop:text-brand-gray-600 desktop:text-[14px] mt-4 mb-4 px-[10px] py-[12px] desktop:px-0 desktop:py-[8px]">
          복약 필터
        </h2>
        <div
          className={`h-full overflow-y-auto transition-max-height duration-300`}
        >
          <ul>
            {nonAllowedDuplicates.length === 0 ? (
              <div className="px-2 text-[15px] text-brand-gray-600">
                등록된 복약 기록이 없습니다.
              </div>
            ) : (
              nonAllowedDuplicates.map((medicine) => (
                <li
                  key={medicine.id}
                  className="flex items-center desktop:mb-3 mb-4"
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedMedicines.includes(medicine.id)}
                      onChange={() => handleCheckboxChange(medicine)}
                    />
                    <div
                      className={`w-[18px] h-[18px] flex items-center justify-center border rounded ${
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
                      className={`ml-3 text-[14px] ${
                        selectedMedicines.includes(medicine.id)
                          ? "text-brand-gray-800"
                          : "text-brand-gray-400"
                      }`}
                    >
                      {medicine.medi_nickname}
                    </span>
                  </label>
                </li>
              ))
            )}
          </ul>
        </div>
      </Modal>
      {/* desktop filter box 부분 */}
      <div
        className={`hidden desktop:block h-full flex flex-col overflow-y-auto`}
      >
        <div className="ml-4">
          <h2 className="text-brand-gray-600 text-[14px] mt-6 mb-2 py-[8px]">
            복용 약 필터
          </h2>
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
                      className={`w-[18px] h-[18px] flex items-center justify-center border rounded ${
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
                      className={`ml-3 text-[14px] ${
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
    </div>
  );
};

export default CalendarCheckbox;