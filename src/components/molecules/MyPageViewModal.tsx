import React, { useState } from 'react';
import { ChevronLeft } from "lucide-react";
import { format } from 'date-fns';

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
  const [editedRecord, setEditedRecord] = useState(mediRecord);

  if (!isOpen) return null;

  const formatTimes = () => {
    const times = [];
    if (mediRecord.times.morning) times.push("아침");
    if (mediRecord.times.afternoon) times.push("점심");
    if (mediRecord.times.evening) times.push("저녁");
    return times;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editedRecord);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRecord(mediRecord);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(mediRecord.id);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yy.MM.dd');
  };

  const formatDaysOfWeek = (days: string[] | undefined) => {
    if (!days || days.length === 0) return '매일';
    const koreanDays = {
      '월': '월요일', '화': '화요일', '수': '수요일', '목': '목요일',
      '금': '금요일', '토': '토요일', '일': '일요일'
    };
    return days.map(day => koreanDays[day as keyof typeof koreanDays]).join(', ');
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-4 py-3">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <ChevronLeft size={24} />
          </button>
          <span className="text-gray-800 text-lg font-bold">나의 약</span>
          {isEditing ? (
            <button onClick={handleSave} className="text-blue-500 hover:text-blue-700">
              저장
            </button>
          ) : (
            <button onClick={handleEdit} className="text-blue-500 hover:text-blue-700">
              수정
            </button>
          )}
        </div>
        <div className="flex-grow p-4">
          <div className="w-full">
            {isEditing ? (
              <input
                type="text"
                value={editedRecord.medi_nickname}
                onChange={(e) => setEditedRecord({...editedRecord, medi_nickname: e.target.value})}
                className="text-[18px] font-bold mb-4 text-brand-gray-800 w-full"
              />
            ) : (
              <h2 className="text-[18px] font-bold mb-4 text-brand-gray-800">{mediRecord.medi_nickname}</h2>
            )}
            <div className="space-y-6">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedRecord.medi_name}
                    onChange={(e) => setEditedRecord({...editedRecord, medi_name: e.target.value})}
                    className="text-[14px] text-brand-gray-800 w-full"
                  />
                ) : (
                  <p className="text-[14px] text-brand-gray-800">{mediRecord.medi_name}</p>
                )}
              </div>
              <div>
                <span className="text-[14px] font-bold text-brand-gray-600">복용시간대</span>
                <div className="flex space-x-2 mt-2">
                  {formatTimes().map((time, index) => (
                    <div key={index} className="w-14 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs">
                      ({time})
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[14px] font-bold text-brand-gray-600">복용기간</span>
                {isEditing ? (
                  <div className="flex space-x-2 mt-2">
                    <input
                      type="date"
                      value={editedRecord.start_date}
                      onChange={(e) => setEditedRecord({...editedRecord, start_date: e.target.value})}
                      className="text-[14px] text-brand-gray-800"
                    />
                    <span>~</span>
                    <input
                      type="date"
                      value={editedRecord.end_date}
                      onChange={(e) => setEditedRecord({...editedRecord, end_date: e.target.value})}
                      className="text-[14px] text-brand-gray-800"
                    />
                  </div>
                ) : (
                  <p className="text-[14px] text-brand-gray-800 mt-2">
                    {formatDate(mediRecord.start_date)} ~ {formatDate(mediRecord.end_date)}
                  </p>
                )}
                {isEditing ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['월', '화', '수', '목', '금', '토', '일'].map(day => (
                      <button
                        key={day}
                        onClick={() => {
                          const updatedDays = editedRecord.day_of_week?.includes(day)
                            ? editedRecord.day_of_week.filter(d => d !== day)
                            : [...(editedRecord.day_of_week || []), day];
                          setEditedRecord({...editedRecord, day_of_week: updatedDays});
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          editedRecord.day_of_week?.includes(day) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[14px] text-brand-gray-800 mt-2">
                    {formatDaysOfWeek(mediRecord.day_of_week)}
                  </p>
                )}
              </div>
              <div>
                <span className="text-[14px] font-bold text-brand-gray-600">복용 알람</span>
                {isEditing ? (
                  <input
                    type="time"
                    value={editedRecord.notification_time?.[0] || ''}
                    onChange={(e) => setEditedRecord({...editedRecord, notification_time: [e.target.value]})}
                    className="text-[14px] text-brand-gray-800 mt-2 w-full"
                  />
                ) : (
                  <p className="text-[14px] text-brand-gray-800 mt-2">{mediRecord.notification_time?.[0] || '설정 안 함'}</p>
                )}
              </div>
              <div>
                <span className="text-[14px] font-bold text-brand-gray-600">메모</span>
                {isEditing ? (
                  <textarea
                    value={editedRecord.notes}
                    onChange={(e) => setEditedRecord({...editedRecord, notes: e.target.value})}
                    className="text-[14px] text-brand-gray-800 mt-2 w-full h-24 p-2 border rounded"
                  />
                ) : (
                  <p className="text-[14px] text-brand-gray-800 mt-2">{mediRecord.notes}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-between p-4">
            <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 rounded">
              취소
            </button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPageViewModal;