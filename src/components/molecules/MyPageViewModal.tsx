import React, { useState, useEffect } from 'react';
import { ChevronLeft } from "lucide-react";
import { format } from 'date-fns';
import axios from 'axios';

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
  itemImage?: string | null;
  user_id: string;
  notification_time?: string[];
  day_of_week?: string[];
  repeat?: boolean;
}

interface MyPageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediRecord: MediRecord;
  onUpdate: (updatedRecord: MediRecord) => void;
  onDelete: (id: string) => void;
}

const MyPageViewModal: React.FC<MyPageViewModalProps> = ({
  isOpen,
  onClose,
  mediRecord,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecord, setEditedRecord] = useState<MediRecord>(mediRecord);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediNames, setMediNames] = useState<{ itemName: string }[]>([]);
  const [notificationEnabled, setNotificationEnabled] = useState(!!mediRecord.repeat);

  useEffect(() => {
    setEditedRecord(mediRecord);
    setNotificationEnabled(!!mediRecord.repeat);
  }, [mediRecord]);

  useEffect(() => {
    fetchMediNames();
  }, []);

  const fetchMediNames = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/calendar/medi/names');
      setMediNames(response.data);
    } catch (error) {
      console.error("Error fetching medication names:", error);
      setError("약 이름을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (time: 'morning' | 'afternoon' | 'evening') => {
    setEditedRecord((prev) => ({
      ...prev,
      times: { ...prev.times, [time]: !prev.times[time] },
    }));
  };

  const handleDayOfWeekChange = (day: string) => {
    setEditedRecord((prev) => ({
      ...prev,
      day_of_week: prev.day_of_week
        ? prev.day_of_week.includes(day)
          ? prev.day_of_week.filter((d) => d !== day)
          : [...prev.day_of_week, day]
        : [day],
    }));
  };

  const handleNotificationTimeChange = (value: string) => {
    setEditedRecord((prev) => ({
      ...prev,
      notification_time: [value],
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/mypage/medi/${editedRecord.id}`, {
        ...editedRecord,
        repeat: notificationEnabled,
      });
      if (response.status === 200) {
        onUpdate(response.data);
        setIsEditing(false);
      }
    } catch (err) {
      setError('업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('Error updating medication:', err);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/mypage/medi/${mediRecord.id}`);
      if (response.status === 200) {
        onDelete(mediRecord.id);
        onClose();
      }
    } catch (err) {
      setError('삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('Error deleting medication:', err);
    }
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yy.MM.dd');
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <ChevronLeft size={24} />
          </button>
          <span className="text-gray-800 text-lg font-bold">나의 약</span>
          {isEditing ? (
            <button onClick={handleSave} className="text-blue-500 hover:text-blue-700">
              저장
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700">
              수정
            </button>
          )}
        </div>
        <div className="flex-grow p-4 space-y-4">
          <div className="mb-2">
            <input
              type="text"
              name="medi_nickname"
              placeholder="약 별명(최대 6자)"
              value={editedRecord.medi_nickname}
              onChange={handleInputChange}
              className="border rounded w-full h-[40px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
              disabled={!isEditing}
            />
          </div>

          <div className="mb-5">
            <select
              name="medi_name"
              value={editedRecord.medi_name}
              onChange={handleInputChange}
              className="border rounded w-full h-[40px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
              disabled={!isEditing || isLoading}
            >
              <option value="">약 이름 선택</option>
              {isLoading ? (
                <option value="" disabled>로딩 중...</option>
              ) : (
                mediNames.map((item, index) => (
                  <option key={index} value={item.itemName}>
                    {item.itemName}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="mb-5">
            <label className="block text-[14px] font-bold mb-2 text-brand-gray-600">복용 시간</label>
            <div className="flex space-x-4 text-brand-gray-800 justify-between w-full">
              {['morning', 'afternoon', 'evening'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => isEditing && handleTimeChange(time as 'morning' | 'afternoon' | 'evening')}
                  className={`px-4 py-2 rounded-full ${
                    editedRecord.times[time as 'morning' | 'afternoon' | 'evening']
                      ? "bg-brand-primary-500 text-white"
                      : "bg-brand-gray-50 text-brand-gray-800"
                  } w-1/3`}
                  disabled={!isEditing}
                >
                  {time === 'morning' ? '아침' : time === 'afternoon' ? '점심' : '저녁'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2 flex items-center">
              <div className="flex items-center">
                <input
                  type="date"
                  name="start_date"
                  value={editedRecord.start_date}
                  onChange={handleInputChange}
                  className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none w-3/4"
                  disabled={!isEditing}
                />
                <span className="ml-3 text-brand-gray-800">부터</span>
              </div>
            </div>
            <div className="w-1/2 flex items-center">
              <div className="flex items-center">
                <input
                  type="date"
                  name="end_date"
                  value={editedRecord.end_date}
                  onChange={handleInputChange}
                  className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none w-3/4"
                  disabled={!isEditing}
                />
                <span className="ml-3 text-brand-gray-800">까지</span>
              </div>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <label className="flex items-center">
              <span className="ml-2 text-brand-gray-600">알림 설정 </span>
              <div
                onClick={() => isEditing && setNotificationEnabled(!notificationEnabled)}
                className={`relative w-12 h-6 flex items-center rounded-full ml-3 cursor-pointer ${
                  notificationEnabled ? "bg-brand-primary-400" : "bg-brand-gray-400"
                }`}
              >
                <div
                  className={`absolute w-6 h-6 bg-white rounded-full transition-transform transform ${
                    notificationEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </label>
          </div>

          {notificationEnabled && (
            <>
              <div className="mb-4">
                <div className="flex justify-between w-full mb-4">
                  {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => isEditing && handleDayOfWeekChange(day)}
                      className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-[16px] font-bold ${
                        editedRecord.day_of_week?.includes(day)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-brand-gray-800"
                      }`}
                      disabled={!isEditing}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <input
                  type="time"
                  name="notification_time"
                  value={editedRecord.notification_time?.[0] || ""}
                  onChange={(e) => handleNotificationTimeChange(e.target.value)}
                  className="border rounded w-full h-[40px] py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                  disabled={!isEditing}
                />
              </div>
            </>
          )}

          <div className="mb-10">
            <label className="block text-[16px] font-bold mb-2 text-brand-gray-600">메모</label>
            <textarea
              name="notes"
              value={editedRecord.notes}
              onChange={handleInputChange}
              placeholder="약에 대한 간단한 기록"
              className="border rounded w-full h-[80px] py-2 px-3 text-gray-700 leading-tight focus:outline-none resize-none"
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-brand-primary-50 text-brand-primary-500 rounded w-32"
              >
                삭제
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-brand-primary-500 text-brand-primary-50 w-32"
              >
                수정
              </button>
            </div>
          )}
        </div>
      </div>
    
      {error && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default MyPageViewModal;