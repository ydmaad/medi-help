"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
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
}

interface EditMediModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (updatedMediRecord: MediRecord) => void;
  mediRecord: MediRecord;
}

const EditMediModal: React.FC<EditMediModalProps> = ({
  isOpen,
  onRequestClose,
  onDelete,
  onUpdate,
  mediRecord,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMediRecord, setUpdatedMediRecord] = useState(mediRecord);

  useEffect(() => {
    setUpdatedMediRecord(mediRecord);
  }, [mediRecord]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setUpdatedMediRecord((prevRecord) => ({
        ...prevRecord,
        times: {
          ...prevRecord.times,
          [name]: checked,
        },
      }));
    } else {
      setUpdatedMediRecord((prevRecord) => ({
        ...prevRecord,
        [name]: value,
      }));
    }
  };

  const handleTimeButtonClick = (time: keyof typeof updatedMediRecord.times) => {
    setUpdatedMediRecord((prevRecord) => ({
      ...prevRecord,
      times: {
        ...prevRecord.times,
        [time]: !prevRecord.times[time],
      },
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(`/api/calendar/medi`, updatedMediRecord);
      if (response.status === 200) {
        onUpdate(updatedMediRecord);
        setIsEditing(false);
        onRequestClose();
      } else {
        console.error("Failed to update medi record:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to update medi record:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/calendar/medi`, { data: { id: mediRecord.id } });
      if (response.status === 200) {
        onDelete(mediRecord.id);
        onRequestClose();
      } else {
        console.error("Failed to delete medi record:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete medi record:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="복용중인 약 정보 수정"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto z-50">
        <h2 className="text-2xl mb-4">복용중인 약 정보 수정</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">약 이름:</label>
          {isEditing ? (
            <input
              type="text"
              name="medi_name"
              value={updatedMediRecord.medi_name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          ) : (
            <p>{mediRecord.medi_name}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">약 별명:</label>
          {isEditing ? (
            <input
              type="text"
              name="medi_nickname"
              value={updatedMediRecord.medi_nickname}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          ) : (
            <p>{mediRecord.medi_nickname}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">복용 기간:</label>
          {isEditing ? (
            <>
              <input
                type="date"
                name="start_date"
                value={updatedMediRecord.start_date}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <input
                type="date"
                name="end_date"
                value={updatedMediRecord.end_date}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
              />
            </>
          ) : (
            <p>{mediRecord.start_date} ~ {mediRecord.end_date}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">복용 시간:</label>
          {isEditing ? (
            <div className="flex space-x-4 justify-between w-full">
              <button
                type="button"
                onClick={() => handleTimeButtonClick("morning")}
                className={`px-4 py-2 rounded-lg ${
                  updatedMediRecord.times.morning ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} w-1/3`}
              >
                아침
              </button>
              <button
                type="button"
                onClick={() => handleTimeButtonClick("afternoon")}
                className={`px-4 py-2 rounded-lg ${
                  updatedMediRecord.times.afternoon ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} w-1/3`}
              >
                점심
              </button>
              <button
                type="button"
                onClick={() => handleTimeButtonClick("evening")}
                className={`px-4 py-2 rounded-lg ${
                  updatedMediRecord.times.evening ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} w-1/3`}
              >
                저녁
              </button>
            </div>
          ) : (
            <p>{mediRecord.times.morning && "아침 "} {mediRecord.times.afternoon && "점심 "} {mediRecord.times.evening && "저녁"}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">메모:</label>
          {isEditing ? (
            <textarea
              name="notes"
              value={updatedMediRecord.notes}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          ) : (
            <p>{mediRecord.notes}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                저장
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                수정
              </button>
              <button
                onClick={onRequestClose}
                className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                닫기
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            삭제
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditMediModal;
