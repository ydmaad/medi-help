"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter
import { supabase } from '@/utils/supabase/client';
import MediModal from './myPageModal/MediModal';  // Import the new MediModal component

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
  notification_time?: string[];
  day_of_week?: string[];
  repeat?: boolean;
}

interface MediListsProps {
  className?: string; // Add className prop
}

const MediLists: React.FC<MediListsProps> = ({ className }) => {
  const [mediRecords, setMediRecords] = useState<MediRecord[]>([]);
  const [selectedMediRecord, setSelectedMediRecord] = useState<MediRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter(); // Initialize router

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
    router.push('/mypage/Medications'); // Navigate to the Medications page
  };

  const handleEditClick = () => {
    console.log("Edit clicked");
    // Handle edit functionality here
  };

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      {/* Wrapper for title and cards */}
      <div className="bg-[#f5f6f7] p-6 rounded-2xl w-full max-w-7xl h-full" style={{ height: '500px' }}> {/* Set height */}
        {/* Title section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-1000 text-left">
            나의 복용 약 
            <span className="text-[#279ef9] text-3xl font-bold ml-2">{mediRecords.length}개</span>
            <button 
              onClick={handleShowAllClick}
              className="text-[#279ef9] text-3xl font-bold ml-1"
            >
              &gt;
            </button>
          </h2>
        </div>

        {/* Cards section */}
        <div className="flex gap-8"> {/* Adjust gap */}
          {displayedMediRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white p-4 rounded-2xl flex flex-col items-start w-64 min-w-[16rem] h-80" // Set height for consistency
            >
              <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden">
                {record.itemImage ? (
                  <Image
                    src={record.itemImage}
                    alt={record.medi_name || "기본 이미지"}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-xl">
                    <p className="text-gray-500">이미지 없음</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start w-full">
                <p className="text-xl font-semibold text-gray-1000 mb-3 text-left">
                  {record.medi_nickname}
                </p>
                <p className="text-lg text-gray-800 mb-3 text-left">
                  {record.medi_name}
                </p>
                <p className="text-lg mb-4 text-[#279ef9] text-left">
                  {record.start_date} ~ {record.end_date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMediRecord && (
        <MediModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          mediRecord={selectedMediRecord}
          onEditClick={handleEditClick}
        />
      )}
    </div>
  );
};

export default MediLists;
