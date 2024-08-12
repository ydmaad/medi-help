import React from "react";
import Modal from "react-modal";
import { FaTimes, FaEdit } from "react-icons/fa";

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
  itemImage?: string | null;
  notification_time?: string[];
  day_of_week?: string[];
  repeat?: boolean;
}

interface MediModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  mediRecord: MediRecord;
  onEditClick: () => void;
}

const MediModal: React.FC<MediModalProps> = ({ isOpen, onRequestClose, mediRecord, onEditClick }) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Medication Details"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto relative">
        <button
          type="button"
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="text-xl" />
        </button>
        
        <h2 className="text-2xl mb-4">약 정보</h2>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">약 별명:</label>
          <p className="text-gray-700">{mediRecord.medi_nickname}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">약 이름:</label>
          <p className="text-gray-700">{mediRecord.medi_name}</p>
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="block text-sm font-bold mb-2">복용 시작일:</label>
            <p className="text-gray-700">{mediRecord.start_date}</p>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-bold mb-2">복용 종료일:</label>
            <p className="text-gray-700">{mediRecord.end_date}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">복용 시간:</label>
          <p className="text-gray-700">
            {mediRecord.times.morning && "아침 "} 
            {mediRecord.times.afternoon && "점심 "} 
            {mediRecord.times.evening && "저녁 "}
          </p>
        </div>

        {mediRecord.notification_time && mediRecord.repeat && (
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">알림 시간:</label>
            {mediRecord.notification_time.map((time, index) => (
              <p key={index} className="text-gray-700">
                {formatTime(time)}
              </p>
            ))}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">메모:</label>
          <p className="text-gray-700">{mediRecord.notes}</p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onEditClick}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          >
            <FaEdit className="mr-2" /> 편집
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MediModal;
