"use client";

import React from "react";
import Modal from "react-modal";

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
  user_id: string;
}

interface MediInfoModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  mediRecord: MediRecord;
}

const MediInfoModal: React.FC<MediInfoModalProps> = ({ isOpen, onRequestClose, mediRecord }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="약 정보"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto z-50">
        <h2 className="text-2xl mb-4">{mediRecord.medi_nickname}</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">약 정보:</label>
          <p>{mediRecord.medi_name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">복용 시간대:</label>
          <p>{mediRecord.times.morning && "아침 "} {mediRecord.times.afternoon && "점심 "} {mediRecord.times.evening && "저녁"}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">복용 기간:</label>
          <p>{mediRecord.start_date} ~ {mediRecord.end_date}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">메모:</label>
          <p>{mediRecord.notes}</p>
        </div>
        <button
          onClick={onRequestClose}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          닫기
        </button>
      </div>
    </Modal>
  );
};

export default MediInfoModal;
