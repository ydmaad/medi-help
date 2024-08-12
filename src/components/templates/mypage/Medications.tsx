// src/components/templates/mypage/Medications.tsx

"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';

import EditMediModal from './myPageModal/EditMediModal';
import MediModal from './myPageModal/MediModal';

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
  itemImage?: string | null;
  user_id: string;
  notification_time?: string[];
  day_of_week?: string[];
  repeat?: boolean;
}

const Medications: React.FC = () => {
  const [mediRecords, setMediRecords] = useState<MediRecord[]>([]);
  const [selectedMediRecord, setSelectedMediRecord] = useState<MediRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchMediRecords = async () => {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        console.error("Auth session missing!");
        return;
      }
      const userId = session.data.session.user.id;
      try {
        const response = await axios.get(`/api/mypage/medi/names?user_id=${userId}`);
        setMediRecords(response.data);
      } catch (error) {
        console.error("Error fetching medi records:", error);
      }
    };
    fetchMediRecords();
  }, []);

  const handleMediClick = (record: MediRecord) => {
    setSelectedMediRecord(record);
    setIsViewModalOpen(true);
  };

  const handleUpdate = (updatedMediRecord: MediRecord) => {
    setMediRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === updatedMediRecord.id ? updatedMediRecord : record
      )
    );
  };

  const handleDelete = (id: string) => {
    setMediRecords((prevRecords) =>
      prevRecords.filter((record) => record.id !== id)
    );
  };

  const openEditModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setIsViewModalOpen(true);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-8 py-4 bg-white rounded-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-1000">복약 리스트</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {mediRecords.map((record) => (
          <div
            key={record.id}
            className="bg-gray-50 p-4 rounded-2xl mb-4 flex flex-col items-start cursor-pointer"
            onClick={() => handleMediClick(record)}
          >
            {record.itemImage ? (
              <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden">
                <Image
                  src={record.itemImage}
                  alt={record.medi_name || "기본 이미지"}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 rounded-xl"
                />
              </div>
            ) : (
              <div className="w-full h-32 mb-4 flex items-center justify-center bg-gray-200 rounded-xl overflow-hidden">
                <p className="text-gray-500">이미지 없음</p>
              </div>
            )}
            <p className="text-lg font-semibold text-gray-1000 mb-2">{record.medi_nickname}</p>
            <p className="text-sm text-gray-800 mb-2">{record.medi_name}</p>
            <p className="text-sm text-primary-500 mb-2">복용 기간 | {record.start_date} ~ {record.end_date}</p>
          </div>
        ))}
      </div>
      {selectedMediRecord && (
        <>
          <MediModal
            isOpen={isViewModalOpen}
            onRequestClose={() => setIsViewModalOpen(false)}
            onEditClick={openEditModal}
            mediRecord={selectedMediRecord}
          />
          <EditMediModal
            isOpen={isEditModalOpen}
            onRequestClose={closeEditModal}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            mediRecord={selectedMediRecord}
          />
        </>
      )}
    </div>
  );
};

export default Medications;
