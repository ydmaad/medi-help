import React from "react";
import Modal from "react-modal";
import { FaTimes, FaEdit } from "react-icons/fa";
import { useMediaQuery } from 'react-responsive'; // 모바일 화면 크기 체크

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
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' }); // 모바일 화면 크기 체크

  const formatTimes = () => {
    const times = [];
    if (mediRecord.times.morning) times.push("아침");
    if (mediRecord.times.afternoon) times.push("점심");
    if (mediRecord.times.evening) times.push("저녁");
    return times.join(", ");
  };

  const renderContent = () => (
    <div className={`bg-white rounded-md shadow-lg p-6 ${isMobile ? 'mx-4 my-4' : 'w-full max-w-[432px] mx-auto'} ${isMobile ? 'max-w-full' : ''}`}>
      {isMobile ? (
        <>
          <div className="flex justify-between items-center px-4 py-3 bg-gray-100 border-b border-gray-300">
            <button
              type="button"
              onClick={onRequestClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>
            <span className="text-gray-800 text-lg font-bold">나의 약 수정</span>
            <button
              type="button"
              onClick={onEditClick}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit className="text-xl" />
            </button>
          </div>
          <div className="p-4 bg-white rounded-md shadow-lg" style={{ width: '332px', height: '345px' }}>
            <h2 className="text-[18px] font-bold mb-2 text-brand-gray-800">{mediRecord.medi_nickname}</h2>
            <div className="text-[14px] font-bold mb-4 text-brand-gray-800">{mediRecord.medi_name}</div>
            <div className="text-[14px] font-bold mb-4 text-brand-gray-600">복용 날짜: <span className="font-bold text-brand-gray-600">{mediRecord.start_date} ~ {mediRecord.end_date}</span></div>
            
            <div className="text-[14px] font-bold mb-4 text-brand-gray-600">복용 알람: <span className="text-brand-gray-800">{mediRecord.notification_time?.[0] || '설정 안 함'}</span></div>
            <div className="flex space-x-2 mb-4">
              {['월', '화', '수', '목', '금', '토', '일'].map(day => (
                <div key={day} className={`w-8 h-8 flex items-center justify-center rounded-full ${mediRecord.day_of_week?.includes(day) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                  {day}
                </div>
              ))}
            </div>
            <div className="text-[14px] font-bold mb-4 text-brand-gray-600">메모:</div>
            <div className="border rounded p-2 text-brand-gray-800">{mediRecord.notes}</div>
          </div>
        </>
      ) : (
        <>
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
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={onEditClick}
              className="w-[107px] h-[40px] bg-brand-primary-500 text-white rounded-md flex items-center justify-center"
            >
              <FaEdit className="mr-2" /> 편집
            </button>
          </div>
        </>
      )}
    </div>
  );

  return isMobile ? (
    <div className="flex flex-col h-screen bg-gray-50">
      {renderContent()}
    </div>
  ) : (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Medication Details"
      className="fixed inset-0 flex items-center justify-center z-50 px-4 py-6"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      {renderContent()}
    </Modal>
  );
};

export default MediModal;
