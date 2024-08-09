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

const Medications: React.FC = () => {
  const [mediRecords, setMediRecords] = useState<MediRecord[]>([]);

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

  return (
    <div className="max-w-screen-xl mx-auto px-8 py-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl mb-4">전체 약 목록</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mediRecords.map((record) => (
          <div
            key={record.id}
            className="bg-gray-100 p-4 rounded shadow mb-2 flex flex-col items-start"
          >
            {record.itemImage ? (
              <Image
                src={record.itemImage}
                alt={record.medi_name || "기본 이미지"}
                width={200}
                height={200}
                className="w-full mb-2 object-contain"
              />
            ) : (
              <div className="w-full h-40 mb-2 flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">이미지 없음</p>
              </div>
            )}
            <p className="text-lg font-semibold">{record.medi_nickname}</p>
            <p className="text-sm text-gray-500 mt-1"> 약 이름 | {record.medi_name}</p>
            <p className="text-sm text-gray-500">
             복용 기간 |  {record.start_date} ~ {record.end_date}
            </p>
            <p className="text-sm text-gray-500 mt-1">메모 | {record.notes}</p>
            <div className="flex space-x-2 mt-2">
              {record.times.morning && <span className="text-xs bg-blue-200 text-blue-800 rounded px-2 py-1">아침</span>}
              {record.times.afternoon && <span className="text-xs bg-blue-200 text-blue-800 rounded px-2 py-1">점심</span>}
              {record.times.evening && <span className="text-xs bg-blue-200 text-blue-800 rounded px-2 py-1">저녁</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Medications;
