"use client";

import React from 'react';
import Modal from 'react-modal';

interface MediRecord {
  id: string;
  medi_name: string;
  times: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  notes: string;
  created_at: string;
}

interface ViewMediModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  mediRecord: MediRecord;
  onEdit: (id: string, updatedRecord: Partial<MediRecord>) => void;
  onDelete: (id: string) => void;
}

const ViewMediModal: React.FC<ViewMediModalProps> = ({ isOpen, onRequestClose, mediRecord, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(mediRecord.id, mediRecord);
    onRequestClose();
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (confirmDelete) {
      onDelete(mediRecord.id);
    }
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="View Medication"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto z-50">
        <h2 className="text-2xl mb-4">복용 중인 약</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">약 이름:</label>
          <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            {mediRecord.medi_name}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">메모:</label>
          <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            {mediRecord.notes}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">먹기 시작한 날짜:</label>
          <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            {new Date(mediRecord.created_at).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            수정하기
          </button>
          <button
            onClick={handleDelete}
            className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            삭제하기
          </button>
          <button
            onClick={onRequestClose}
            className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewMediModal;
