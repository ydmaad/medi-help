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

interface AddMediModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onAdd: (newMediRecord: MediRecord) => void;
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}
const AddMediModal: React.FC<AddMediModalProps> = ({
  isOpen,
  onRequestClose,
  onAdd,
  toast,
}) => {

  const { user } = useAuthStore();
  const [mediName, setMediName] = useState("");
  const [mediNickname, setMediNickname] = useState("");
  const [mediNames, setMediNames] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [times, setTimes] = useState({
    morning: false,
    afternoon: false,
    evening: false,
  });
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState<string[]>([]);
  const [notificationTime, setNotificationTime] = useState<string[]>([""]);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    const fetchMediNames = async () => {
      try {
        const response = await axios.get("/api/calendar/medi/names");
        setMediNames(
          response.data.map((item: { itemName: string }) => item.itemName)
        );
      } catch (error) {
        console.error("Failed to fetch medi names:", error);
      }
    };

    fetchMediNames();
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimes({ ...times, [e.target.name]: e.target.checked });
  };

  const validateForm = () => {
    if (!mediNickname.trim()) {
      toast.error("약 별명을 입력해주세요.");
      return false;
    }
    if (mediNickname.length > 6) {
      toast.error("약 별명은 최대 6자입니다.");
      return false;
    }
    if (!mediName) {
      toast.error("약 이름을 등록해주세요.");
      return false;
    }
    if (!startDate || !endDate) {
      toast.error("복용 기간을 선택해주세요.");
      return false;
    }
    if (notificationEnabled && notificationTime[0] === "") {
      toast.error("알림 시간을 설정해주세요.");
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!user) return;
    if (!validateForm()) return;

    const newMediRecord: MediRecord = {
      id: crypto.randomUUID(),
      medi_name: mediName,
      medi_nickname: mediNickname,
      times: {
        morning: times.morning || false,
        afternoon: times.afternoon || false,
        evening: times.evening || false,
      },
      notes,
      start_date: startDate,
      end_date: endDate,
      created_at: new Date().toISOString(),
      user_id: user.id,
      day_of_week: notificationEnabled ? dayOfWeek : [],
      notification_time: notificationEnabled ? notificationTime : [],
      repeat: false,
    };

    try {
      console.log("Sending medication data:", newMediRecord);
      const response = await axios.post("/api/calendar/medi", newMediRecord);
      console.log("Server response:", response.data);

      if (response.status === 201) {
        console.log("Medication added successfully");
        onAdd(newMediRecord);

        // Clear form state
        setMediName("");
        setMediNickname("");
        setTimes({ morning: false, afternoon: false, evening: false });
        setNotes("");
        setStartDate("");
        setEndDate("");
        setDayOfWeek([]);
        setNotificationTime([""]);
        setNotificationEnabled(false);
        onRequestClose();
      }
      else {
        console.error("Failed to add record:", response.statusText);
        toast.error("약 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to add record:", error);
      toast.error("약 등록 중 오류가 발생했습니다.");
    }
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

  const handleAddNotificationTime = () => {
    setNotificationTime([...notificationTime, ""]);
  };

  const handleRemoveNotificationTime = (index: number) => {
    const updatedNotificationTime = notificationTime.filter((_, i) => i !== index);
    setNotificationTime(updatedNotificationTime);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Medication"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      <div className="bg-white rounded-lg p-8 max-w-md mx-auto z-50 relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-brand-gray-1000"
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

        <h2 className="text-2xl mb-4 text-brand-gray-800">나의 약</h2>

        {/* 약 별명 입력 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="약 별명(최대 6자)"
            value={mediNickname}
            onChange={(e) => setMediNickname(e.target.value)}
            className="border rounded w-full py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
          />
        </div>

        {/* 약 이름 입력 */}
        <div className="mb-4">
          <input
            list="mediNames"
            placeholder="약 이름을 검색하세요"
            value={mediName}
            onChange={(e) => {
              setMediName(e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="border rounded w-full py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
          />
          <datalist id="mediNames">
            {mediNames
              .filter((name) =>
                name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((name, index) => (
                <option key={index} value={name} />
              ))}
          </datalist>
        </div>

        {/* 복용 시간 설정 */}
        <div className="mb-4">
          <label className="block text-brand-gray-600 text-sm font-bold mb-2">
            나의 약 등록
          </label>
          <div className="flex space-x-4 text-brand-gray-800 justify-between w-full">
            <button
              type="button"
              onClick={() => setTimes({ ...times, morning: !times.morning })}
              className={`px-4 py-2 rounded-full ${
                times.morning
                  ? "bg-brand-primary-500 text-white"
                  : "bg-brand-gray-50 text-brand-gray-800"
              } w-1/3`}
            >
              아침
            </button>
            <button
              type="button"
              onClick={() =>
                setTimes({ ...times, afternoon: !times.afternoon })
              }
              className={`px-4 py-2 rounded-full ${
                times.afternoon
                  ? "bg-brand-primary-500 text-white"
                  : "bg-brand-gray-50 text-brand-gray-800"
              } w-1/3`}
            >
              점심
            </button>
            <button
              type="button"
              onClick={() => setTimes({ ...times, evening: !times.evening })}
              className={`px-4 py-2 rounded-full ${
                times.evening
                  ? "bg-brand-primary-500 text-white"
                  : "bg-brand-gray-50 text-brand-gray-800"
              } w-1/3`}
            >
              저녁
            </button>
          </div>
        </div>

        {/* 복용 기간 설정 */}
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2 flex items-center">
            <div className="flex items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none w-3/4" // 너비 조정
              />
              <span className="ml-3 text-brand-gray-800 ">부터</span>
            </div>
          </div>
          <div className="w-1/2 flex items-center">
            <div className="flex items-center">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none w-3/4" // 너비 조정
              />
              <span className="ml-3 text-brand-gray-800 ">까지</span>
            </div>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-brand-gray-600">알림 설정</span>
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
          </div>
          {notificationEnabled && (
            <button
              onClick={handleAddNotificationTime}
              className="text-brand-primary-500 hover:text-brand-primary-700"
            >
              추가
            </button>
          )}
        </div>

        {notificationEnabled && (
          <div className="mb-4">
            <div className="flex flex-wrap space-x-2 mb-5">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayOfWeekChange(day)}
                  className={`px-4 py-2 rounded-full ${
                    dayOfWeek.includes(day)
                      ? "bg-brand-primary-500 text-white"
                      : "bg-brand-gray-50 text-brand-gray-800"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {notificationTime.map((time, index) => (
              <div key={index} className="flex mb-2 items-center">
                <input
                  type="time"
                  value={time}
                  onChange={(e) =>
                    handleNotificationTimeChange(index, e.target.value)
                  }
                  className="border rounded w-full py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
                />
                <button
                  onClick={() => handleRemoveNotificationTime(index)}
                  className="ml-2 text-brand-gray-600 hover:text-brand-gray-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 메모 입력 */}
        <div className="mb-4">
          <label className="block text-brand-gray-600 text-sm font-bold mb-2">
            메모:
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="약에 대한 간단한 기록"
            className="border rounded w-full py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none resize-none h-16"
          />
        </div>
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleAdd}
            className="px-6 py-2 bg-brand-primary-500 text-white rounded w-40"
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddMediModal;
