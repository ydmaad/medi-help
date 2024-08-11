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
    <div className="max-w-screen-xl mx-auto px-8 py-4 bg-white rounded-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">복약 리스트</h2> {/* Increased font size and added margin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {mediRecords.map((record) => (
          <div
            key={record.id}
            className="bg-gray-50 p-4 rounded-2xl mb-4 flex flex-col items-start"
          >
            {record.itemImage ? (
              <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden"> {/* Adjusted height */}
                <Image
                  src={record.itemImage}
                  alt={record.medi_name || "기본 이미지"}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 rounded-xl"
                />
              </div>
            ) : (
              <div className="w-full h-32 mb-4 flex items-center justify-center bg-gray-200 rounded-xl overflow-hidden"> {/* Adjusted height */}
                <p className="text-gray-500">이미지 없음</p>
              </div>
            )}
            <p className="text-lg font-semibold text-gray-900 mb-2">{record.medi_nickname}</p>
            <p className="text-sm text-gray-800 mb-2">{record.medi_name}</p>
            <p className="text-sm text-blue-500 mb-2">복용 기간 | {record.start_date} ~ {record.end_date}</p> {/* Added margin above */}
        

          </div>
        ))}
      </div>
    </div>
  );
};

export default Medications;