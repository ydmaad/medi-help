import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
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
  user_id: string;
  itemImage?: string | null;
  notification_time?: string[];
  day_of_week?: string[];
  repeat?: boolean;
  is_sent?: false;
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
  const [formData, setFormData] = useState<MediRecord>({
    ...mediRecord,
    day_of_week: mediRecord.day_of_week || [],
    notification_time: mediRecord.notification_time || [],
  });
  const [mediNames, setMediNames] = useState<{ itemName: string }[]>([]);
  const [notificationEnabled, setNotificationEnabled] = useState(!!mediRecord.repeat);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

useEffect(() => {
  const toastContainer = document.querySelector('.Toastify');
  if (toastContainer) {
    (toastContainer as HTMLElement).style.zIndex = '10000'; // 매우 높은 z-index 값 설정
  }
}, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    toast[type](message);
  };
  
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'medi_nickname' && value.length > 6) {
      showToast("약 별명은 최대 6글자입니다.", "error");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  
  const handleTimeChange = (time: 'morning' | 'afternoon' | 'evening') => {
    setFormData((prevData) => ({
      ...prevData,
      times: {
        ...prevData.times,
        [time]: !prevData.times[time],
      },
    }));
  };

  const handleDayOfWeekChange = (day: string) => {
    setFormData((prevData) => ({
      ...prevData,
      day_of_week: prevData.day_of_week
        ? prevData.day_of_week.includes(day)
          ? prevData.day_of_week.filter((d) => d !== day)
          : [...prevData.day_of_week, day]
        : [day],
    }));
  };

  const handleNotificationTimeChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      notification_time: [value],
    }));
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`/api/mypage/medi/${formData.id}`);
      onDelete(formData.id);
      onRequestClose();
    } catch (error) {
      console.error("Error deleting medication record:", error);
      showToast("약 정보 삭제 중 오류가 발생했습니다.", "error");
    }
  };

  const validateForm = () => {
    if (!formData.medi_nickname.trim()) {
      showToast("약 별명을 입력해주세요.", "error");
      return false;
    }
    if (!formData.medi_name) {
      showToast("약 이름을 선택해주세요.", "error");
      return false;
    }
    if (!formData.start_date || !formData.end_date) {
      showToast("복용 기간을 선택해주세요.", "error");
      return false;
    }
    return true;
  };


  const handleUpdateClick = async () => {
    if (!validateForm()) return;
  
    try {
      await axios.put(`/api/mypage/medi/${formData.id}`, {
        ...formData,
        repeat: notificationEnabled,
      });
      onUpdate(formData);
      onRequestClose();
    } catch (error) {
      console.error("Error updating medication record:", error);
      showToast("약 정보 수정 중 오류가 발생했습니다.", "error");
    }
  };
  const fetchMediNames = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/calendar/medi/names');
      setMediNames(response.data);
    } catch (error) {
      console.error("Error fetching medication names:", error);
      toast.error("약 이름 목록을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMediNames();
  }, []);

  useEffect(() => {
    setFormData({
      ...mediRecord,
      day_of_week: mediRecord.day_of_week || [],
      notification_time: mediRecord.notification_time || [],
    });
    setNotificationEnabled(!!mediRecord.repeat);
  }, [mediRecord]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Medication"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
      ariaHideApp={false}
    >
      <div className="bg-white rounded-lg p-6 max-w-[432px] w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onRequestClose}
          className="absolute top-6 right-6 text-gray-700"
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

        <h2 className="text-[16px] font-bold mb-5 text-brand-gray-800">나의 약</h2>

        <div className="mb-2">
          <input
            type="text"
            name="medi_nickname"
            placeholder="약 별명(최대 6자)"
            value={formData.medi_nickname}
            onChange={handleInputChange}
            className="border rounded w-full h-[40px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
          />
        </div>

        <div className="mb-5">
          <select
            name="medi_name"
            value={formData.medi_name}
            onChange={handleInputChange}
            className="border rounded w-full h-[40px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
            disabled={isLoading}
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
          <label className="block text-[14px] font-bold mb-2 text-brand-gray-600">나의 약 등록:</label>
          <div className="flex space-x-4 text-brand-gray-800 justify-between w-full">
            {['morning', 'afternoon', 'evening'].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleTimeChange(time as 'morning' | 'afternoon' | 'evening')}
                className={`px-4 py-2 rounded-full ${
                  formData.times[time as 'morning' | 'afternoon' | 'evening']
                    ? "bg-brand-primary-500 text-white"
                    : "bg-brand-gray-50 text-brand-gray-800"
                } w-1/3`}
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
                value={formData.start_date}
                onChange={handleInputChange}
                className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none w-3/4"
              />
              <span className="ml-3 text-brand-gray-800">부터</span>
            </div>
          </div>
          <div className="w-1/2 flex items-center">
            <div className="flex items-center">
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none w-3/4"
              />
              <span className="ml-3 text-brand-gray-800">까지</span>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <label className="flex items-center">
            <span className="ml-2 text-brand-gray-600">알림 설정 </span>
            <div
              onClick={() => setNotificationEnabled(!notificationEnabled)}
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
                    onClick={() => handleDayOfWeekChange(day)}
                    className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-[16px] font-bold ${
                      formData.day_of_week?.includes(day)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-brand-gray-800"
                    }`}
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
                value={formData.notification_time?.[0] || ""}
                onChange={(e) => handleNotificationTimeChange(e.target.value)}
                className="border rounded w-full h-[40px] py-2 px-3 text-gray-700 leading-tight focus:outline-none"
              />
            </div>
          </>
        )}

        <div className="mb-10">
          <label className="block text-[16px] font-bold mb-2 text-brand-gray-600">메모</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="약에 대한 간단한 기록"
            className="border rounded w-full h-[80px] py-2 px-3 text-gray-700 leading-tight focus:outline-none resize-none"
          />
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            type="button"
            onClick={handleDeleteClick}
            className="px-4 py-2 rounded-md bg-brand-primary-50 text-brand-primary-500"
          >
            삭제
          </button>
          <button
            type="button"
            onClick={handleUpdateClick}
            className="px-4 py-2 rounded-md bg-brand-primary-500 text-brand-primary-50"
          >
            수정
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditMediModal;
