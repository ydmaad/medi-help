"use client";

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

interface MediRecord {
  id: string;
  medi_name: string;
  times: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  alarm_time: string;
  notes: string;
}

interface EditMediModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onEdit: (id: string, updatedRecord: Partial<MediRecord>) => void;
  onDelete: (id: string, deleteMedi: boolean) => void;
  mediRecord: MediRecord;
}

const EditMediModal: React.FC<EditMediModalProps> = ({ isOpen, onRequestClose, onEdit, onDelete, mediRecord }) => {
  const [alarmTime, setAlarmTime] = useState(mediRecord.alarm_time);
  const [mediNames, setMediNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchMediNames = async () => {
      try {
        const response = await axios.get("/api/calendar/medi/names");
        setMediNames(response.data.map((item: { itemName: string }) => item.itemName));
      } catch (error) {
        console.error("Failed to fetch medi names:", error);
      }
    };

    fetchMediNames();
    setAlarmTime(mediRecord.alarm_time);
  }, [mediRecord]);

  const handleEdit = () => {
    onEdit(mediRecord.id, { alarm_time: alarmTime });
    onRequestClose();
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("복용 중인 약에서도 함께 삭제할까요?");
    onDelete(mediRecord.id, confirmDelete);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Medication Alarm"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto z-50">
        <h2 className="text-2xl mb-4">알람 수정</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">약 이름:</label>
          <select
            value={mediRecord.medi_name}
            onChange={(e) => onEdit(mediRecord.id, { medi_name: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">약 이름을 선택하세요</option>
            {mediNames.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">알람 시간:</label>
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
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
        </div>
      </div>
    </Modal>
  );
};

export default EditMediModal;
