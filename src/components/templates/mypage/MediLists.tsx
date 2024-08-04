"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/client';

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

  const displayedMediRecords = showAll ? mediRecords : mediRecords.slice(0, 5);

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-4xl">
      <h2 className="text-xl mb-4 text-center">복용 중인 약</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {displayedMediRecords.map((record) => (
            <div
              key={record.id}
              className="bg-gray-100 p-4 rounded shadow mb-2 w-full md:w-1/5 flex flex-col items-center"
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
          {!showAll && mediRecords.length > 5 && (
            <div className="w-full md:w-1/5 p-4 flex items-center justify-center">
              <button
                onClick={() => setShowAll(true)}
                className="text-blue-500 hover:underline"
              >
                더보기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediLists;
