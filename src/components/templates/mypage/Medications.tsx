"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import EditMediModal from './myPageModal/EditMediModal';
import MediModal from './myPageModal/MediModal';
import { format } from 'date-fns';

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
  return format(date, 'yy.MM.dd');
};

const Medications: React.FC = () => {
  const [mediRecords, setMediRecords] = useState<MediRecord[]>([]);
  const [selectedMediRecord, setSelectedMediRecord] = useState<MediRecord | null>(null);
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

  const ITEMS_PER_PAGE = isMobile ? 8 : 15;
  const totalPages = Math.ceil(mediRecords.length / ITEMS_PER_PAGE);
  const currentRecords = mediRecords.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);





  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 mt-20 text-brand-gray-1000 text-left">복약 리스트</h2>
      <div className={`grid ${
  isMobile 
    ? 'grid-cols-2 gap-4 justify-items-center' 
    : 'grid-cols-5 gap-6'
} mx-auto max-w-[calc(100%-2rem)]`}>
  {currentRecords.map((record) => (
    <div
      key={record.id}
      className="bg-white border border-brand-gray-50 p-3 md:p-4 rounded-2xl flex flex-col items-start cursor-pointer w-full h-full min-h-[190px] md:min-h-[300px] max-w-[170px] md:max-w-none flex-shrink-0"
      onClick={() => handleMediClick(record)}
    >
      <div className="relative w-full pb-[66.67%] mb-2">
        {record.itemImage ? (
          <div className="absolute inset-1 rounded-xl overflow-hidden">
            <Image
              src={record.itemImage}
              alt={record.medi_nickname || "약 이미지"}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ) : (
          <div className="absolute inset-1 flex items-center justify-center bg-gray-200 rounded-xl">
            <p className="text-brand-gray-400 text-xs md:text-sm">이미지 없음</p>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-start flex-grow w-full space-y-0.5">
        <p className="text-base md:text-lg font-bold text-brand-gray-1000 line-clamp-2">{record.medi_nickname}</p>
        <p className="text-sm md:text-base text-brand-gray-800 line-clamp-1">{record.medi_name}</p>
        <p className="text-sm md:text-sm text-brand-primary-500 line-clamp-1">
          {formatDate(record.start_date)} ~ {formatDate(record.end_date)}
        </p>
      </div>
    </div>
  ))}
</div>
<div className="flex justify-center mt-4 space-x-1">
  <button
    className="px-4 py-2 text-brand-gray-400"
    disabled={currentPage === 1}
    onClick={() => handlePageChange(currentPage - 1)}
  >
    &lt;
  </button>
  {pageNumbers.map((pageNumber) => (
    <button
      key={pageNumber}
      className={`px-4 py-2 ${
        currentPage === pageNumber 
          ? 'text-brand-gray-1000 font-bold' 
          : 'text-brand-gray-400'
      }`}
      onClick={() => handlePageChange(pageNumber)}
    >
      {pageNumber}
    </button>
  ))}
  <button
    className="px-4 py-2 text-brand-gray-400"
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