"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMediModal from "../calendarModal/AddMediModal";
import EditMediModal from "../calendarModal/EditMediModal";
import ViewMediModal from "../calendarModal/ViewMediModal";
import { useAuthStore } from "@/store/auth";

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
  const [selectedMediRecord, setSelectedMediRecord] = useState<MediRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchMediRecords = async () => {
      try {
        if (user) {
          const response = await axios.get(`/api/calendar/medi?user_id=${user.id}`);
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
      prevRecords.map((record) => (record.id === updatedMediRecord.id ? updatedMediRecord : record))
    );
  };

  const handleDeleteMediRecord = (id: string) => {
    setMediRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
  };

  // 날짜 비교 시 시간을 제거하고 비교합니다.
  const stripTime = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const currentDate = stripTime(new Date());
  const filteredMediRecords = mediRecords.filter((record) => {
    const startDate = stripTime(new Date(record.start_date));
    const endDate = stripTime(new Date(record.end_date));
    return currentDate >= startDate && currentDate <= endDate;
  });

  return (
    <div className="p-4">
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
            <p className="text-sm text-gray-500">{record.start_date} ~ {record.end_date}</p>
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
