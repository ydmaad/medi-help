"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import EditMediModal from './myPageModal/EditMediModal';
import MediModal from './myPageModal/MediModal';

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

const ITEMS_PER_PAGE = 15; // 한 페이지에 표시할 항목 수

const Medications: React.FC = () => {
  const [mediRecords, setMediRecords] = useState<MediRecord[]>([]);
  const [selectedMediRecord, setSelectedMediRecord] = useState<MediRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleMediClick = (record: MediRecord) => {
    setSelectedMediRecord(record);
    setIsViewModalOpen(true);
  };

  const handleUpdate = (updatedMediRecord: MediRecord) => {
    setMediRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === updatedMediRecord.id ? updatedMediRecord : record
      )
    );
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

  const totalPages = Math.ceil(mediRecords.length / ITEMS_PER_PAGE);
  const currentRecords = mediRecords.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 페이지 번호 배열 생성
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4">
      <h2 className="text-3xl font-bold mb-6 mt-20 text-gray-1000 text-left">복약 리스트</h2>
      <div className="grid grid-cols-5 gap-8">
        {currentRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white border border-brand-gray-50 p-4 rounded-2xl flex flex-col items-start cursor-pointer w-full h-[300px] min-w-[150px] flex-shrink-0 overflow-hidden"
            onClick={() => handleMediClick(record)}
          >
            {record.itemImage ? (
              <div className="relative w-full" style={{ paddingBottom: '66.67%' }}>
                <Image
                  src={record.itemImage}
                  alt={record.medi_name || "기본 이미지"}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 rounded-xl p-2"
                />
              </div>
            ) : (
              <div className="relative w-full" style={{ paddingBottom: '66.67%' }}>
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-xl p-2">
                  <p className="text-gray-500 text-sm">이미지 없음</p>
                </div>
              </div>
            )}
            <div className="flex flex-col justify-between flex-grow mt-2">
              <p className="text-lg font-semibold text-gray-1000 mb-1 truncate">{record.medi_nickname}</p>
              <p className="text-sm text-gray-800 mb-1 truncate">{record.medi_name}</p>
              <p className="text-sm text-[#279ef9] truncate">{record.start_date} ~ {record.end_date}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-1">
        <button
          className="px-4 py-2 text-black"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &lt;
        </button>
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`px-4 py-2 ${currentPage === pageNumber ? 'text-[#279ef9]' : 'text-black'}`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button
          className="px-4 py-2 text-black"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &gt;
        </button>
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
            onRequestClose={closeEditModal}
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
