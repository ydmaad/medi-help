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
    router.push('/mypage/Medications');
  };

  const handleMediClick = (record: MediRecord) => {
    setSelectedMediRecord(record);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full md:w-1/2 lg:w-2/3 p-4 bg-gray-50 rounded-2xl">
      <div className="flex justify-between items-center mb-6"> {/* Increased bottom margin */}
        <div className="flex items-center">
          <h2 className="text-xl cursor-pointer text-gray-1000" onClick={handleShowAllClick}> {/* Changed color */}
            나의 복용 약 <span className="text-primary-500">{mediRecords.length}개</span> {/* Changed color */}
          </h2>
          {mediRecords.length > 3 && (
            <button
              onClick={handleShowAllClick}
              className="text-primary-500 hover:underline ml-2" 
            >
              &gt;
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Increased gap */}
        {displayedMediRecords.map((record) => (
          <div
            key={record.id}
            className="bg-gray-50 p-4 rounded-2xl flex flex-col items-start cursor-pointer"
            onClick={() => handleMediClick(record)}
          >
            {record.itemImage ? (
              <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden"> {/* Added bottom margin */}
                <Image
                  src={record.itemImage}
                  alt={record.medi_name || "기본 이미지"}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
              </div>
            ) : (
              <div className="w-full h-40 mb-4 flex items-center justify-center bg-gray-200 rounded-xl"> {/* Added bottom margin */}
                <p className="text-gray-500">이미지 없음</p>
              </div>
            )}
            <p className="text-lg font-semibold text-gray-1000 mb-2">{record.medi_nickname}</p> {/* Added bottom margin */}
            <p className="text-sm text-gray-800 mb-1">{record.medi_name}</p> {/* Changed color and added bottom margin */}
            <p className="text-sm text-primary-500 mb-2">{record.start_date} ~ {record.end_date}</p> {/* Changed color and added bottom margin */}
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
