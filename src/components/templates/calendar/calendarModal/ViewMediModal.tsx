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
  notification_time?: string[];
  day_of_week?: string[];
  repeat?: boolean;
}

interface ViewMediModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onEditClick: () => void;
  mediRecord: MediRecord;
}

const ViewMediModal: React.FC<ViewMediModalProps> = ({
  isOpen,
  onRequestClose,
  onEditClick,
  mediRecord,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="View Medication"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto z-50">
        <h2 className="text-2xl mb-4">약 정보</h2>
        <div className="mb-4">
          <p>
            <strong>약 이름:</strong> {mediRecord.medi_name}
          </p>
        </div>
        <div className="mb-4">
          <p>
            <strong>약 별명:</strong> {mediRecord.medi_nickname}
          </p>
        </div>
        <div className="mb-4">
          <p>
            <strong>복용 시작일:</strong> {mediRecord.start_date}
          </p>
        </div>
        <div className="mb-4">
          <p>
            <strong>복용 종료일:</strong> {mediRecord.end_date}
          </p>
        </div>
        <div className="mb-4">
          <p>
            <strong>복용 시간:</strong>{" "}
            {`
            ${mediRecord.times.morning ? "아침 " : ""}
            ${mediRecord.times.afternoon ? "점심 " : ""}
            ${mediRecord.times.evening ? "저녁 " : ""}
          `}
          </p>
        </div>
        <div className="mb-4">
          <p>
            <strong>메모:</strong> {mediRecord.notes}
          </p>
        </div>
        {mediRecord.notification_time && mediRecord.notification_time.length > 0 && (
          <>
            <div className="mb-4">
              <p>
                <strong>알림 요일:</strong>{" "}
                {mediRecord.day_of_week ? mediRecord.day_of_week.join(", ") : "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <p>
                <strong>알림 시간:</strong>{" "}
                {mediRecord.notification_time ? mediRecord.notification_time.join(", ") : "N/A"}
              </p>
            </div>
          </>
        )}
        <div className="flex items-center justify-between">
          <button
            onClick={onEditClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            수정하기
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
