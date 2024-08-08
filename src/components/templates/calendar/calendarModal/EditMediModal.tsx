import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useAuthStore } from "@/store/auth";

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
  day_of_week: string[];
  notification_time: string[];
  repeat: boolean;
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
  const { user } = useAuthStore();
  const [mediNickname, setMediNickname] = useState(mediRecord.medi_nickname);
  const [times, setTimes] = useState(mediRecord.times);
  const [notes, setNotes] = useState(mediRecord.notes);
  const [startDate, setStartDate] = useState(mediRecord.start_date);
  const [endDate, setEndDate] = useState(mediRecord.end_date);
  const [dayOfWeek, setDayOfWeek] = useState(mediRecord.day_of_week || []);
  const [notificationTime, setNotificationTime] = useState(
    mediRecord.notification_time || []
  );
  const [repeat, setRepeat] = useState(mediRecord.repeat);
  const [notificationEnabled, setNotificationEnabled] = useState(
    (mediRecord.day_of_week && mediRecord.day_of_week.length > 0) ||
      (mediRecord.notification_time && mediRecord.notification_time.length > 0)
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimes({ ...times, [e.target.name]: e.target.checked });
  };

  const handleUpdate = async () => {
    if (!user) return;

    const updatedMediRecord: MediRecord = {
      ...mediRecord,
      medi_nickname: mediNickname,
      times,
      notes,
      start_date: startDate,
      end_date: endDate,
      day_of_week: notificationEnabled ? dayOfWeek : [],
      notification_time: notificationEnabled ? notificationTime : [],
      repeat,
    };

    try {
      const response = await axios.put(
        `/api/calendar/medi?id=${mediRecord.id}`,
        updatedMediRecord
      );
      if (response.status === 200) {
        onUpdate(updatedMediRecord);
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
      const response = await axios.delete(
        `/api/calendar/medi?id=${mediRecord.id}`
      );
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

  const handleToggleChange = () => {
    setNotificationEnabled(!notificationEnabled);
  };

  const handleDayOfWeekChange = (day: string) => {
    setDayOfWeek((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleNotificationTimeChange = (index: number, value: string) => {
    const updatedNotificationTime = [...notificationTime];
    updatedNotificationTime[index] = value;
    setNotificationTime(updatedNotificationTime);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Medication"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto z-50 overflow-auto">
        <h2 className="text-2xl mb-4">약 정보</h2>
        <div className="mb-4">
          <p>
            <strong>약 이름:</strong> {mediRecord.medi_name}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            약 별명:
          </label>
          <input
            type="text"
            value={mediNickname}
            onChange={(e) => setMediNickname(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              복용 시작일:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              복용 종료일:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            복용 시간:
          </label>
          <div className="flex space-x-4 justify-between w-full">
            <button
              type="button"
              onClick={() => setTimes({ ...times, morning: !times.morning })}
              className={`px-4 py-2 rounded-lg ${
                times.morning
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } w-1/3`}
            >
              아침
            </button>
            <button
              type="button"
              onClick={() =>
                setTimes({ ...times, afternoon: !times.afternoon })
              }
              className={`px-4 py-2 rounded-lg ${
                times.afternoon
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } w-1/3`}
            >
              점심
            </button>
            <button
              type="button"
              onClick={() => setTimes({ ...times, evening: !times.evening })}
              className={`px-4 py-2 rounded-lg ${
                times.evening
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } w-1/3`}
            >
              저녁
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            메모:
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            알림 설정:
          </label>
          <input
            type="checkbox"
            checked={notificationEnabled}
            onChange={handleToggleChange}
            className="toggle-checkbox"
          />
        </div>
        {notificationEnabled && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                알림 요일:
              </label>
              <div className="flex space-x-2">
                {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayOfWeekChange(day)}
                    className={`px-4 py-2 rounded-lg ${
                      dayOfWeek.includes(day)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                알림 시간:
              </label>
              <input
                type="time"
                value={notificationTime[0]}
                onChange={(e) =>
                  handleNotificationTimeChange(0, e.target.value)
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <label className="block text-gray-700 text-sm font-bold ml-4">
                반복:
              </label>
              <input
                type="checkbox"
                checked={repeat}
                onChange={() => setRepeat(!repeat)}
                className="toggle-checkbox ml-2"
              />
            </div>
          </>
        )}
        <div className="flex items-center justify-between">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            수정하기
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            삭제하기
          </button>
          <button
            onClick={onRequestClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            취소
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditMediModal;
