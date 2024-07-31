"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMediModal from "../calendarModal/AddMediModal";
import EditMediModal from "../calendarModal/EditMediModal";
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchMediRecords = async () => {
      try {
        if (user) {
          const response = await axios.get(`/api/calendar/medi?user_id=${user.id}`);
          console.log('Fetched records:', response.data.medicationRecords); // 추가된 로그
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

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">복용중인 약 목록</h2>
      {mediRecords.map((record) => (
        <div
          key={record.id}
          className="bg-gray-100 p-4 rounded shadow mb-2 cursor-pointer"
          onClick={() => {
            setSelectedMediRecord(record);
            setIsEditModalOpen(true);
          }}
        >
          <div>
            <p className="text-lg font-semibold">{record.medi_nickname}</p>
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
        <EditMediModal
          key={selectedMediRecord.id}
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
