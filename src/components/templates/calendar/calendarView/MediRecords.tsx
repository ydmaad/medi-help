"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMediModal from "../calendarModal/AddMediModal";
import EditMediModal from "../calendarModal/EditMediModal";
import ViewMediModal from "../calendarModal/ViewMediModal";
import { useAuthStore } from "@/store/auth";
import PillComponent from "@/components/molecules/MediScheduleCard";

export const MOCK_DATA = [
  {
    time: "12:00",
    pillName: "키커지는약",
    timeOfDay: "morning",
    hasTaken: true,
  },
  {
    time: "12:00",
    pillName: "똑똑해지는약",
    timeOfDay: "morning",
    hasTaken: false,
  },
  {
    time: "12:00",
    pillName: "잘생겨지는약",
    timeOfDay: "lunch",
    hasTaken: true,
  },
  {
    time: "12:00",
    pillName: "살빠지는약",
    timeOfDay: "lunch",
    hasTaken: false,
  },
];
interface MediRecord {
  id: string;
  medi_name: string;
  medi_nickname: string;
  times: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  notes: string;
  start_date: string;
  end_date: string;
  created_at: string;
  user_id: string;
}

const MediRecords: React.FC = () => {
  const [mediRecords, setMediRecords] = useState<MediRecord[]>([]);
  const [selectedMediRecord, setSelectedMediRecord] =
    useState<MediRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user } = useAuthStore();
  const [tabNumber, setTabNumber] = useState<number>(0);
  const [timeOfDay, setTimeOfDay] = useState<string>("morning");

  useEffect(() => {
    const fetchMediRecords = async () => {
      try {
        if (user) {
          const response = await axios.get(
            `/api/calendar/medi?user_id=${user.id}`
          );
          setMediRecords(response.data.medicationRecords);
        }
      } catch (error) {
        console.error("Error fetching medication records:", error);
      }
    };

    fetchMediRecords();
  }, [user]);

  const handleAddMediRecord = (newMediRecord: MediRecord) => {
    setMediRecords((prevRecords) => [...prevRecords, newMediRecord]);
  };

  const handleUpdateMediRecord = (updatedMediRecord: MediRecord) => {
    setMediRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === updatedMediRecord.id ? updatedMediRecord : record
      )
    );
  };

  const handleDeleteMediRecord = (id: string) => {
    setMediRecords((prevRecords) =>
      prevRecords.filter((record) => record.id !== id)
    );
  };

  // 날짜 비교 시 시간을 제거하고 비교합니다.
  const stripTime = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const currentDate = stripTime(new Date());
  const filteredMediRecords = mediRecords.filter((record) => {
    const startDate = stripTime(new Date(record.start_date));
    const endDate = stripTime(new Date(record.end_date));
    return currentDate >= startDate && currentDate <= endDate;
  });

  return (
    <div className="p-4">
      <div className="border border-[#F5F6F7] bg-[#FBFBFB] p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-between gap-6 text-[16px] font-normal">
            <div
              className={`cursor-pointer ${
                tabNumber === 0 ? "font-bold" : "text-[#7C7F86]"
              }`}
              onClick={() => setTabNumber(0)}
            >
              복약 리스트
            </div>
            <div
              className={`cursor-pointer ${
                tabNumber === 1 ? "font-bold" : "text-[#7C7F86]"
              }`}
              onClick={() => setTabNumber(1)}
            >
              노트
            </div>
          </div>
          <div className="text-[16px] text-[#279EF9]">편집</div>
        </div>
        {tabNumber === 0 ? (
          <>
            <div className="flex gap-2 justify-start items-center mb-2">
              <button
                onClick={() => setTimeOfDay("morning")}
                className={`${
                  timeOfDay === "morning"
                    ? "rounded-full bg-[#9CD2FC] w-8 h-8 text-[12px] text-[#155189]"
                    : "rounded-full bg-[#F5F6F7] w-8 h-8 text-[12px] text-[#BCBFC1]"
                } `}
              >
                아침
              </button>
              <button
                onClick={() => setTimeOfDay("lunch")}
                className={`${
                  timeOfDay === "lunch"
                    ? "rounded-full bg-[#9CD2FC] w-8 h-8 text-[12px] text-[#155189]"
                    : "rounded-full bg-[#F5F6F7] w-8 h-8 text-[12px] text-[#BCBFC1]"
                } `}
              >
                점심
              </button>
              <button
                onClick={() => setTimeOfDay("dinner")}
                className={`${
                  timeOfDay === "dinner"
                    ? "rounded-full bg-[#9CD2FC] w-8 h-8 text-[12px] text-[#155189]"
                    : "rounded-full bg-[#F5F6F7] w-8 h-8 text-[12px] text-[#BCBFC1]"
                } `}
              >
                저녁
              </button>
            </div>
            <div className="flex flex-col w-full gap-2">
              {/* {MOCK_DATA.filter((e) => e.timeOfDay === timeOfDay).map((ele) => (
                <PillComponent key={ele.pillName} pill={ele} />
              ))} */}
            </div>
          </>
        ) : null}
        {tabNumber === 1 ? (
          <textarea
            className="min-h-[125px] p-4 w-full text-[16px] font-normal resize-none"
            value="신경불안약 먹으니까 너무 졸림. 약 복용 주기 4시간 지키면서 복용하기"
          ></textarea>
        ) : null}
      </div>
      <h2 className="text-xl mb-4">오늘 복용중인 약 목록</h2>
      {filteredMediRecords.map((record) => (
        <div
          key={record.id}
          className="bg-gray-100 p-4 rounded shadow mb-2 cursor-pointer"
          onClick={() => {
            setSelectedMediRecord(record);
            setIsViewModalOpen(true);
          }}
        >
          <div>
            <p className="text-lg font-semibold">{record.medi_nickname}</p>
            <p className="text-sm text-gray-500">
              {record.start_date} ~ {record.end_date}
            </p>
          </div>
        </div>
      ))}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        나의 약 등록
      </button>

      {selectedMediRecord && (
        <ViewMediModal
          key={selectedMediRecord.id}
          isOpen={isViewModalOpen}
          onRequestClose={() => setIsViewModalOpen(false)}
          onEditClick={() => {
            setIsViewModalOpen(false);
            setIsEditModalOpen(true);
          }}
          mediRecord={selectedMediRecord}
        />
      )}

      {selectedMediRecord && (
        <EditMediModal
          key={selectedMediRecord.id + "-edit"}
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          onDelete={handleDeleteMediRecord}
          onUpdate={handleUpdateMediRecord}
          mediRecord={selectedMediRecord}
        />
      )}

      <AddMediModal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMediRecord}
      />
    </div>
  );
};

export default MediRecords;
