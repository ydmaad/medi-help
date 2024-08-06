// src/components/templates/mypage/MediLists.tsx
"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import MediInfoModal from './myPageModal/MediInfoModal';

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
  itemImage: string | null;
  user_id: string;
}

const MediLists: React.FC = () => {
  const [mediRecords, setMediRecords] = useState<MediRecord[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedMediRecord, setSelectedMediRecord] = useState<MediRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

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

  const displayedMediRecords = mediRecords.slice(0, 3);

  const handleShowAllClick = () => {
    router.push('/mypage/medications');
  };

  const handleMediClick = (record: MediRecord) => {
    setSelectedMediRecord(record);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full md:w-1/2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">현재 복용 중인 약 <span className="text-blue-500">{mediRecords.length}개</span></h2>
        {mediRecords.length > 3 && (
          <button
            onClick={handleShowAllClick}
            className="text-blue-500 hover:underline"
          >
            &gt;
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedMediRecords.map((record) => (
          <div
            key={record.id}
            className="bg-gray-100 p-4 rounded shadow mb-2 flex flex-col items-center"
            onClick={() => handleMediClick(record)}
          >
            {record.itemImage ? (
              <Image
                src={record.itemImage}
                alt={record.medi_name || "기본 이미지"}
                width={200}
                height={200}
                className="w-40 h-40 mb-2 object-contain"
              />
            ) : (
              <div className="w-40 h-40 mb-2 flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">이미지 없음</p>
              </div>
            )}
            <p className="text-lg font-semibold">{record.medi_nickname}</p>
            <p className="text-sm text-gray-500">{record.medi_name}</p>
            <p className="text-sm text-gray-500">
              {record.start_date} ~ {record.end_date}
            </p>
          </div>
        ))}
      </div>
      {selectedMediRecord && (
        <MediInfoModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          mediRecord={selectedMediRecord}
        />
      )}
    </div>
  );
};

export default MediLists;
