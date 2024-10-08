"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import EditMediModal from "./myPageModal/EditMediModal";
import MediModal from "./myPageModal/MediModal";
import MyPageViewModal from '@/components/molecules/MyPageViewModal';
import { format } from "date-fns";
import { useToast } from "@/hooks/useToast";


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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "yy.MM.dd");
};

const Medications: React.FC = () => {
  const [mediRecords, setMediRecords] = useState<MediRecord[]>([]);
  const [selectedMediRecord, setSelectedMediRecord] = useState<MediRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileViewOpen, setIsMobileViewOpen] = useState(false);
  const { toast } = useToast()

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

  useEffect(() => {
    fetchMediRecords();
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMediClick = (record: MediRecord) => {
    setSelectedMediRecord(record);
    if (isMobile) {
      setIsMobileViewOpen(true);
    } else {
      setIsViewModalOpen(true);
    }
  };

  const closeAllModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsMobileViewOpen(false);
    setSelectedMediRecord(null);
  };

  const handleUpdate = async (updatedMediRecord: MediRecord) => {
    try {
      await axios.put(`/api/mypage/medi/${updatedMediRecord.id}`, updatedMediRecord);
      await fetchMediRecords();
      closeAllModals();
      setTimeout(() => {
        toast.success("약 정보가 성공적으로 수정되었습니다.");
      }, 300); // 모달이 완전히 닫힌 후 토스트 표시
    } catch (error) {
      console.error("Error updating medication:", error);
      toast.error("약 정보 수정 중 오류가 발생했습니다.");
    }
  };


  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/mypage/medi/${id}`);
      await fetchMediRecords();
      closeAllModals();
      setTimeout(() => {
        toast.success("약 정보가 삭제되었습니다.");
      }, 300); // 모달이 완전히 닫힌 후 토스트 표시
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast.error("약 정보 삭제 중 오류가 발생했습니다.");
    }
  };
  const openEditModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  const ITEMS_PER_PAGE = isMobile ? 8 : 15;
  const totalPages = Math.ceil(mediRecords.length / ITEMS_PER_PAGE);
  const currentRecords = mediRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4 overflow-x-hidden">
      <div className="w-full md:w-[670px] mx-auto mt-16 md:mt-24">
        <div className="relative">
          <div className="relative">
            <h2 className={`text-[20px] md:text-[24px] font-bold text-brand-gray-800 mb-4 ${isMobile ? 'absolute left-0 top-0 w-full px-4' : 'mb-8'}`}>
              복약 리스트
            </h2>
            
            <div className={`flex justify-center ${isMobile ? 'pt-16' : ''}`}>
              <div className={`overflow-hidden ${isMobile ? 'w-[335px]' : 'w-full'}`}>
                <div
                  className={`grid ${
                    isMobile ? "grid-cols-2" : "grid-cols-5"
                  } gap-${isMobile ? '4' : '6'}`}
                  style={{ gap: isMobile ? '17px' : '24px' }}
                >
                  {currentRecords.map((record) => (
                    <div
                      key={record.id}
                      className={`bg-white border border-brand-gray-50 rounded-xl flex flex-col items-center cursor-pointer p-4 ${
                        isMobile ? "w-[159px] h-[200px]" : "w-[159px] h-[200px]"
                      }`}
                      onClick={() => handleMediClick(record)}
                    >
                      <div className="w-[127px] h-[72px] mb-2">
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
                        <div className="mb-2">
                          <p className="text-[14px] md:text-sm font-bold text-brand-gray-1000 line-clamp-1">
                            {record.medi_nickname}
                          </p>
                          <p className="text-[12px] md:text-xs text-brand-gray-800 line-clamp-1 mt-1">
                            {record.medi_name}
                          </p>
                        </div>
                        <p className="text-[10px] md:text-xs text-brand-primary-500 truncate mt-4">
                          {formatDate(record.start_date)} ~ {formatDate(record.end_date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-4 space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-4 py-2 ${
              currentPage === 1
                ? "text-brand-gray-400 cursor-not-allowed"
                : "text-brand-gray-700"
            }`}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 ${
                currentPage === index + 1
                  ? "text-brand-primary-600"
                  : "text-brand-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={`px-4 py-2 ${
              currentPage === totalPages
                ? "text-brand-gray-400 cursor-not-allowed"
                : "text-brand-gray-700"
            }`}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>

      {selectedMediRecord && (
        <>
          {isMobile ? (
            <MyPageViewModal
              isOpen={isMobileViewOpen}
              onClose={closeAllModals}
              mediRecord={selectedMediRecord}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ) : (
            <>
              <MediModal
                isOpen={isViewModalOpen}
                onRequestClose={() => setIsViewModalOpen(false)}
                onEditClick={openEditModal}
                mediRecord={selectedMediRecord}
              />
              <EditMediModal
                isOpen={isEditModalOpen}
                onRequestClose={closeAllModals}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                mediRecord={selectedMediRecord}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Medications;