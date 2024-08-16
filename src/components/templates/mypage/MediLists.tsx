"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import MediModal from "./myPageModal/MediModal";

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
  className?: string;
}

const MediLists: React.FC<MediListsProps> = ({ className }) => {
  const [mediRecords, setMediRecords] = useState<MediRecord[]>([]);
  const [selectedMediRecord, setSelectedMediRecord] =
    useState<MediRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayedMediRecords, setDisplayedMediRecords] = useState<
    MediRecord[]
  >([]);
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
        const response = await axios.get(
          `/api/mypage/medi/names?user_id=${userId}`
        );
        setMediRecords(response.data);
      } catch (error) {
        console.error("Error fetching medi records:", error);
      }
    };

    fetchMediRecords();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768; // 모바일 기준 너비 설정
      setDisplayedMediRecords(mediRecords.slice(0, isMobile ? 4 : 3));
    };
  
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mediRecords]);

  const handleShowAllClick = () => {
    router.push("/mypage/Medications");
  };

 
  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      <div 
        className="bg-[#f5f6f7] p-4 desktop:p-6 rounded-2xl w-full h-full"
        style={{ 
          aspectRatio: '671 / 352',
          minHeight: '352px', // UserBoard의 높이와 맞춤
        }}
      >
        <div className="mb-4 desktop:mb-6">
          <h2
            className="text-xl desktop:text-2xl font-semibold text-gray-1000 text-left cursor-pointer"
            onClick={handleShowAllClick}
          >
            <span className="text-gray-1000">나의 복용약 </span>
            <span className="text-[#279ef9] text-2xl desktop:text-3xl font-bold">
              {mediRecords.length}개
            </span>
            <span className="text-[#279ef9] text-2xl desktop:text-3xl font-bold ml-2">&gt;</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 desktop:grid-cols-3 gap-3 desktop:gap-6 h-[calc(100%-2rem)]">
          {displayedMediRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white border border-brand-gray-50 p-2 desktop:p-4 rounded-2xl flex flex-col items-start cursor-pointer w-full"
              style={{ aspectRatio: '180 / 217' }}
            >
              <div 
                className="relative w-full mb-2"
                style={{ aspectRatio: '148 / 84' }}
              >
                {record.itemImage ? (
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <Image
                      src={record.itemImage}
                      alt={record.medi_nickname || "약 이미지"}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-xl">
                    <p className="text-brand-gray-400 text-xs desktop:text-sm">이미지 없음</p>
                  </div>
                )}
              </div>
              <div 
                className="flex flex-col justify-start w-full"
                style={{ aspectRatio: '148 / 60' }}
              >
                <p className="text-sm desktop:text-base font-bold text-brand-gray-1000 line-clamp-1">{record.medi_nickname}</p>
                <p className="text-xs desktop:text-sm text-brand-gray-800 line-clamp-1 mt-1">{record.medi_name}</p>
              </div>
              <div 
                className="mt-auto w-full"
                style={{ aspectRatio: '149 / 17' }}
              >
                <p className="text-xs desktop:text-sm text-brand-primary-500">
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
          onEditClick={() => console.log("Edit clicked")}
        />
      )}
    </div>
  );
};

export default MediLists;