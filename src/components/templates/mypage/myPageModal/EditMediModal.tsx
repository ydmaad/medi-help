import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

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

interface EditMediModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onUpdate: (updatedMediRecord: MediRecord) => void;
  onDelete: (id: string) => void;
  mediRecord: MediRecord;
}

const EditMediModal: React.FC<EditMediModalProps> = ({
  isOpen,
  onRequestClose,
  onUpdate,
  onDelete,
  mediRecord,
}) => {
  const [formData, setFormData] = useState(mediRecord);
  const [notificationEnabled, setNotificationEnabled] = useState(!!mediRecord.repeat);

  useEffect(() => {
    setFormData(mediRecord);
    setNotificationEnabled(!!mediRecord.repeat);
  }, [mediRecord]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prevData) => ({
        ...prevData,
        [name]: target.checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      times: {
        ...formData.times,
        [e.target.name]: e.target.checked,
      },
    });
  };

  const handleNotificationTimeChange = (index: number, value: string) => {
    const updatedNotificationTimes = [...(formData.notification_time || [])];
    updatedNotificationTimes[index] = value;
    setFormData({
      ...formData,
      notification_time: updatedNotificationTimes,
    });
  };

  const handleAddNotificationTime = () => {
    setFormData({
      ...formData,
      notification_time: [...(formData.notification_time || []), ""],
    });
  };

  const handleRemoveNotificationTime = (index: number) => {
    const updatedNotificationTimes = (formData.notification_time || []).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      notification_time: updatedNotificationTimes,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`/api/mypage/medi/${formData.id}`, {
        ...formData,
        repeat: notificationEnabled,
      });
      
      if (response.status === 200) {
        onUpdate(formData);
        onRequestClose();
      } else {
        console.error("Failed to update record:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to update record:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/mypage/medi/${formData.id}`);
      
      if (response.status === 200) {
        onDelete(formData.id);
        onRequestClose();  // Close the modal
      } else {
        console.error("Failed to delete record:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };

  const handleNotificationEnabledChange = () => {
    setNotificationEnabled(!notificationEnabled);
    setFormData({
      ...formData,
      repeat: !notificationEnabled,
      day_of_week: !notificationEnabled ? formData.day_of_week : [],
      notification_time: !notificationEnabled ? formData.notification_time : [],
    });
  };

  const handleDayOfWeekChange = (day: string) => {
    setFormData((prevData) => ({
      ...prevData,
      day_of_week: prevData.day_of_week?.includes(day)
        ? prevData.day_of_week.filter((d) => d !== day)
        : [...(prevData.day_of_week || []), day],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Medication"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      <div className="bg-white rounded-lg p-8 max-w-md mx-auto z-50 relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl mb-4">나의 약</h2>

        {/* 약 별명 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">약 별명:</label>
          <input
            type="text"
            name="medi_nickname"
            value={formData.medi_nickname}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
          />
        </div>

        {/* 약 이름 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">약 이름:</label>
          <input
            type="text"
            name="medi_name"
            value={formData.medi_name}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
          />
        </div>

        {/* 복용 기간 설정 */}
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="block text-sm font-bold mb-2">복용 시작일:</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-bold mb-2">복용 종료일:</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            />
          </div>
        </div>

        {/* 복용 시간 설정 */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">나의 약 등록:</label>
          <div className="flex items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="morning"
                checked={formData.times.morning}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">아침</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                name="afternoon"
                checked={formData.times.afternoon}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">점심</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                name="evening"
                checked={formData.times.evening}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">저녁</span>
            </label>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="flex items-center mb-4">
          <label className="flex items-center">
            <div
              onClick={handleNotificationEnabledChange}
              className={`relative w-12 h-6 flex items-center rounded-full cursor-pointer ${
                notificationEnabled ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute w-6 h-6 bg-white rounded-full transition-transform transform ${
                  notificationEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
            <span className="ml-2 text-gray-700">알림 설정</span>
          </label>
        </div>

        {notificationEnabled && (
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">요일:</label>
            <div className="flex flex-wrap space-x-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayOfWeekChange(day)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    (formData.day_of_week || []).includes(day)
                      ? "bg-blue-500"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <label className="block text-sm font-bold mb-2 mt-4">알림 시간:</label>
            {(formData.notification_time || []).map((time, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => handleNotificationTimeChange(index, e.target.value)}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveNotificationTime(index)}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 메모 입력 */}
        <div className="mb-4">
          <label className="block text-sm text-brand-gray-600 font-bold mb-2">메모</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="약에 대한 간단한 기록"
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none resize-none h-16"
          />
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-brand-primary-50 text-brand-primary-500"
          >
            삭제
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-brand-primary-500 text-brand-primary-50"
          >
            수정
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditMediModal;
