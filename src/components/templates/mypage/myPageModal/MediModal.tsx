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

const MediModal: React.FC<MediModalProps> = ({
  isOpen,
  onRequestClose,
  mediRecord,
  onEditClick,
}) => {
  const formatTimes = () => {
    const times = [];
    if (mediRecord.times.morning) times.push("아침");
    if (mediRecord.times.afternoon) times.push("점심");
    if (mediRecord.times.evening) times.push("저녁");
    return times.join(", ");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Medication Details"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto relative">
        <button
          type="button"
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{mediRecord.medi_nickname}</h2>
        </div>

        {/* Grouping the sections */}
        <div className="mb-12 grid gap-4">
          <div className="grid grid-cols-[25%_3%_72%] items-center">
            <p className="text-gray-700 font-semibold">약 이름</p>
            <p className="text-left">|</p>
            <p className="text-gray-700">{mediRecord.medi_name}</p>
          </div>

          <div className="grid grid-cols-[25%_3%_72%] items-center">
            <p className="text-gray-700 font-semibold">복용 시간대</p>
            <p className="text-left">|</p>
            <p className="text-gray-700">{formatTimes()}</p>
          </div>

          <div className="grid grid-cols-[25%_3%_72%] items-center">
            <p className="text-gray-700 font-semibold">복용 기간</p>
            <p className="text-left">|</p>
            <p className="text-gray-700">
              {mediRecord.start_date} ~ {mediRecord.end_date}
            </p>
          </div>

          <div className="grid grid-cols-[25%_3%_72%] items-center">
            <p className="text-gray-700 font-semibold">메모</p>
            <p className="text-left">|</p>
            <p className="text-gray-700">{mediRecord.notes}</p>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center w-full">
          <button
            type="button"
            onClick={onEditClick}
            className="bg-blue-500 text-white px-6 py-2 rounded flex items-center"
          >
            <FaEdit className="mr-2" /> 편집
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MediModal;
