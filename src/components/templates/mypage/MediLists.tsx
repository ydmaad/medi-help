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
  const [selectedMediRecord, setSelectedMediRecord] = useState<MediRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayedMediRecords, setDisplayedMediRecords] = useState<MediRecord[]>([]);
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

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setDisplayedMediRecords(mediRecords.slice(0, isMobile ? 4 : 3));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mediRecords]);

  const handleShowAllClick = () => {
    router.push("/mypage/Medications");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.');
  };

  return (
    <div className={`${className} w-full flex justify-center desktop:block`}>
      <div className="w-[335px] desktop:w-[670px] desktop:h-[352px] overflow-hidden desktop:rounded-2xl desktop:bg-brand-gray-50 desktop:shadow-sm">
        <div className="desktop:px-[49px] desktop:pt-[41px] desktop:pb-[50px] h-full">
          <h2
            className="text-[16px] font-bold text-brand-gray-1000 text-left cursor-pointer mb-2 flex items-center"
            onClick={handleShowAllClick}
          >
            <span className="mb-3 text-[16px]">나의 복용약</span>
            <span className="text-[#279ef9] ml-1 mb-3 text-[16px]">
              {mediRecords.length}개
            </span>
            <span className="text-[#279ef9] ml-1 mb-3 text-[16px]">
              &gt;
            </span>
          </h2>

          <div className="w-full h-full">
            <div className="grid grid-cols-2 gap-[17px] desktop:grid-cols-3 desktop:gap-4">
              {displayedMediRecords.map((record) => (
                <div 
                  key={record.id} 
                  className="w-[159px] desktop:w-auto"
                >
                  <div className="bg-white border border-brand-gray-50 rounded-xl flex flex-col items-center w-[159px] h-[200px] desktop:w-[180px] desktop:h-[217px] p-4">
                    <div className="w-[127px] h-[72px] desktop:w-[148px] desktop:h-[84px] mb-2">
                      {record.itemImage ? (
                        <Image
                          src={record.itemImage}
                          alt={record.medi_nickname || "약 이미지"}
                          width={127}
                          height={72}
                          layout="responsive"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-gray-200 rounded-lg">
                          <p className="text-brand-gray-400 text-xs">이미지 없음</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between w-full flex-grow">
                      <div>
                        <p className="text-[14px] desktop:text-sm font-bold text-brand-gray-1000 line-clamp-1">
                          {record.medi_nickname}
                        </p>
                        <p className="text-[12px] desktop:text-xs text-brand-gray-800 line-clamp-1 mt-1">
                          {record.medi_name}
                        </p>
                      </div>
                      <p className="text-[10px] desktop:text-xs text-brand-primary-500 truncate mt-4">
                        {formatDate(record.start_date)} ~ {formatDate(record.end_date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediLists;