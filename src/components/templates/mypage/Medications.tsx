"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import EditMediModal from "./myPageModal/EditMediModal";
import MediModal from "./myPageModal/MediModal";
import { format } from "date-fns";

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
  const [selectedMediRecord, setSelectedMediRecord] =
    useState<MediRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

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

  const handleMediClick = (record: MediRecord) => {
    setSelectedMediRecord(record);
    setIsViewModalOpen(true);
  };

  const closeAllModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleUpdate = (updatedMediRecord: MediRecord) => {
    setMediRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === updatedMediRecord.id ? updatedMediRecord : record
      )
    );
    closeAllModals();
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4">
      <div className="mx-auto w-[996px]">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-brand-gray-1000 text-left">
          복약 리스트
        </h2>
        <div className="grid grid-cols-5 gap-x-6 gap-y-6">
          {currentRecords.map((record) => (
            <div
              key={record.id}
              className="w-[180px] h-[217px] bg-white border border-brand-gray-50 p-4 rounded-2xl flex flex-col items-start cursor-pointer"
              onClick={() => handleMediClick(record)}
            >
              <div className="w-[148px] h-[84px] mb-2">
                {record.itemImage ? (
                  <div className="w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={record.itemImage}
                      alt={record.medi_nickname || "약 이미지"}
                      width={148}
                      height={84}
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-xl">
                    <p className="text-brand-gray-400 text-xs">이미지 없음</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-start w-full">
                <p className="text-[14px] font-bold text-brand-gray-1000 line-clamp-1 mb-1">
                  {record.medi_nickname}
                </p>
                <p className="text-[12px] text-brand-gray-800 line-clamp-1 mb-4">
                  {record.medi_name}
                </p>
                <p className="text-[12px] text-brand-primary-500 px-1">
                  {formatDate(record.start_date)} ~{" "}
                  {formatDate(record.end_date)}
                </p>
              </div>
            </div>
          ))}
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
          {Array.from(
            { length: Math.ceil(mediRecords.length / ITEMS_PER_PAGE) },
            (_, index) => (
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
            )
          )}
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
    </div>
  );
};
export default Medications;
