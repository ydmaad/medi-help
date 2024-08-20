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
    if (isEditing) {
      fetchMediNames();
    }
  }, [isEditing]);

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
          {isEditing ? (
            <>
              <input
                type="text"
                name="medi_nickname"
                value={editedRecord.medi_nickname}
                onChange={handleInputChange}
                placeholder="약 별명(최대 6자)"
                className="w-full border rounded p-2"
              />
              <select
                name="medi_name"
                value={editedRecord.medi_name}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                disabled={isLoading}
              >
                <option value="">약 이름 선택</option>
            
              
              </select>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">{editedRecord.medi_nickname}</h2>
              <p className="text-gray-600">{editedRecord.medi_name}</p>
            </>
          )}

          <div>
            <h3 className="font-bold mb-2">복용 시간</h3>
            <div className="flex space-x-2">
              {['morning', 'afternoon', 'evening'].map((time) => (
                <button
                  key={time}
                  onClick={() => isEditing && handleTimeChange(time as 'morning' | 'afternoon' | 'evening')}
                  className={`px-4 py-2 rounded-full ${
                    editedRecord.times[time as 'morning' | 'afternoon' | 'evening']
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                  disabled={!isEditing}
                >
                  {time === 'morning' ? '아침' : time === 'afternoon' ? '점심' : '저녁'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">복용 기간</h3>
            {isEditing ? (
              <div className="flex space-x-2">
                <input
                  type="date"
                  name="start_date"
                  value={editedRecord.start_date}
                  onChange={handleInputChange}
                  className="border rounded p-2"
                />
                <span className="self-center">~</span>
                <input
                  type="date"
                  name="end_date"
                  value={editedRecord.end_date}
                  onChange={handleInputChange}
                  className="border rounded p-2"
                />
              </div>
            ) : (
              <p>{formatDate(editedRecord.start_date)} ~ {formatDate(editedRecord.end_date)}</p>
            )}
          </div>

          <div>
            <h3 className="font-bold mb-2">복용 요일</h3>
            <div className="flex space-x-2">
              {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                <button
                  key={day}
                  onClick={() => isEditing && handleDayOfWeekChange(day)}
                  className={`w-8 h-8 rounded-full ${
                    editedRecord.day_of_week?.includes(day)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                  disabled={!isEditing}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">알림 설정</h3>
            <div className="flex items-center">
              <span className="mr-2">알림 {notificationEnabled ? '켜짐' : '꺼짐'}</span>
              {isEditing && (
                <button
                  onClick={() => setNotificationEnabled(!notificationEnabled)}
                  className={`w-12 h-6 rounded-full ${
                    notificationEnabled ? 'bg-blue-500' : 'bg-gray-300'
                  } relative transition-colors duration-300 ease-in-out`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-300 ease-in-out ${
                      notificationEnabled ? 'right-1' : 'left-1'
                    }`}
                  ></div>
                </button>
              )}
            </div>
            {notificationEnabled && (
              <input
                type="time"
                value={editedRecord.notification_time?.[0] || ''}
                onChange={(e) => handleNotificationTimeChange(e.target.value)}
                className="mt-2 border rounded p-2 w-full"
                disabled={!isEditing}
              />
            )}
          </div>

          <div>
            <h3 className="font-bold mb-2">메모</h3>
            {isEditing ? (
              <textarea
                name="notes"
                value={editedRecord.notes}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                rows={3}
              />
            ) : (
              <p>{editedRecord.notes}</p>
            )}
         </div>
{isEditing && (
  <div className="flex justify-center mt-4">
    <button
      onClick={handleDelete}
      className="px-4 py-2 bg-brand-primary-50 text-brand-primary-500 rounded w-32"
    >
      삭제
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