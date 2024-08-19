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
      className="fixed inset-0 flex items-center justify-center z-50 px-4 py-6"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-[432px] mx-auto relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="text-xl" />
        </button>

        <h2 className="text-[16px] font-bold mb-5">{mediRecord.medi_nickname}</h2>

        <div className="flex flex-col space-y-6 mb-10">
          <div className="flex items-center">
            <span className="w-20 text-brand-gray-600">약 정보</span>
            <span className="px-2 text-brand-gray-600">|</span>
            <span className="text-brand-primary-500">{mediRecord.medi_name}</span>
          </div>

          <div className="flex items-center">
            <span className="w-20 text-brand-gray-600">복용시간대</span>
            <span className="px-2 text-brand-gray-600">|</span>
            <span className="text-brand-gray-1000">{formatTimes()}</span>
          </div>

          <div className="flex items-center">
            <span className="w-20 text-brand-gray-600">복용기간</span>
            <span className="px-2 text-brand-gray-600">|</span>
            <span className="text-brand-gray-1000">
              {mediRecord.start_date} ~ {mediRecord.end_date}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-20 text-brand-gray-600">메모</span>
            <span className="px-2 text-brand-gray-600">|</span>
            <span className="text-brand-gray-1000">{mediRecord.notes}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onEditClick}
            className="w-[107px] h-[40px] bg-brand-primary-500 text-white rounded-md flex items-center justify-center"
          >
            <FaEdit className="mr-2" /> 편집
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MediModal;