import React, { useState, useEffect } from 'react';
import { ChevronLeft } from "lucide-react";
import { format } from 'date-fns';
import axios from 'axios';
import { useToast } from "@/hooks/useToast";

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
  const { toast } = useToast();

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
    if (name === 'medi_nickname' && value.length > 6) {
      toast.error("약 별명은 최대 6글자입니다.");
      return;
    }
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

  const validateForm = () => {
    if (!editedRecord.medi_nickname.trim()) {
      toast.error("약 별명을 입력해주세요.");
      return false;
    }
    if (!editedRecord.medi_name) {
      toast.error("약을 선택해주세요.");
      return false;
    }
    if (!editedRecord.start_date || !editedRecord.end_date) {
      toast.error("기간을 설정해주세요.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

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
        toast.success("약 정보가 성공적으로 수정되었습니다.");
      }
    } catch (err) {
      setError('업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.');
      toast.error("약 정보 수정 중 오류가 발생했습니다.");
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
        toast.success("약 정보가 삭제되었습니다.");
      }
    } catch (err) {
      setError('삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
      toast.error("약 정보 삭제 중 오류가 발생했습니다.");
      console.error('Error deleting medication:', err);
    }
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy.MM.dd');
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
          {/* 약 정보 표시 */}
          {!isEditing && (
            <>
              <div className="text-lg font-bold text-brand-gray-800">{mediRecord.medi_nickname}</div>
              <div className="text-sm text-brand-gray-600">{mediRecord.medi_name}</div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-brand-gray-800">복용 날짜</div>
                <div className="text-sm text-brand-gray-800">
                  {formatDate(mediRecord.start_date)} ~ {formatDate(mediRecord.end_date)}
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-brand-gray-800">복용 알람</div>
                <div className="text-sm text-blue-500">
                  {notificationEnabled ? 'ON' : 'OFF'}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm font-bold text-brand-gray-800">메모</div>
                <div className="border rounded p-2 text-sm text-brand-gray-800">
                  {mediRecord.notes || '메모가 없습니다.'}
                </div>
              </div>
            </>
          )}

          {/* 편집 모드에서의 입력 폼 */}
          {isEditing && (
            <>
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
                    mediNames.map((medi, index) => (
                      <option key={index} value={medi.itemName}>
                        {medi.itemName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-brand-gray-800">복용 시간</label>
                <div className="flex items-center space-x-2">
                  {['morning', 'afternoon', 'evening'].map((time) => (
                    <button
                      key={time}
                      className={`border rounded px-2 py-1 ${editedRecord.times[time as keyof typeof editedRecord.times] ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => handleTimeChange(time as 'morning' | 'afternoon' | 'evening')}
                    >
                      {time === 'morning' ? '아침' : time === 'afternoon' ? '점심' : '저녁'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-brand-gray-800">복용 기간</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    name="start_date"
                    value={editedRecord.start_date}
                    onChange={handleInputChange}
                    className="border rounded w-full h-[40px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
                    disabled={!isEditing}
                  />
                  <span>~</span>
                  <input
                    type="date"
                    name="end_date"
                    value={editedRecord.end_date}
                    onChange={handleInputChange}
                    className="border rounded w-full h-[40px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="mb-5">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-brand-gray-800">복용 알람</label>
                  <div className="text-sm text-blue-500">
                    {notificationEnabled ? 'ON' : 'OFF'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setNotificationEnabled(!notificationEnabled)}
                    className={`border rounded px-2 py-1 ${notificationEnabled ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    알람 {notificationEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
                {notificationEnabled && (
                  <>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-brand-gray-800">요일 선택</label>
                      <div className="flex items-center space-x-2">
                        {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                          <button
                            key={day}
                            className={`border rounded px-2 py-1 ${editedRecord.day_of_week?.includes(day) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                            onClick={() => handleDayOfWeekChange(day)}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-brand-gray-800">알람 시간 설정</label>
                      <input
                        type="time"
                        value={editedRecord.notification_time?.[0] || ''}
                        onChange={(e) => handleNotificationTimeChange(e.target.value)}
                        className="border rounded w-full h-[40px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-brand-gray-800">메모</label>
                <textarea
                  name="notes"
                  value={editedRecord.notes}
                  onChange={handleInputChange}
                  className="border rounded w-full h-[80px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
                  disabled={!isEditing}
                />
              </div>
            </>
          )}
        </div>
        {isEditing && (
          <div className="flex justify-between items-center px-4 py-3 border-t">
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              삭제
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPageViewModal;
