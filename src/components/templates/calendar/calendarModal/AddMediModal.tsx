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
}

interface AddMediModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onAdd: (newMediRecord: MediRecord) => void;
}

const AddMediModal: React.FC<AddMediModalProps> = ({
  isOpen,
  onRequestClose,
  onAdd,
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

  const handleAdd = async () => {
    if (!user) return;
  
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
    };
  
    try {
      const response = await axios.post("/api/calendar/medi", newMediRecord);
      if (response.status === 201) {
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
      } else {
        console.error("Failed to add record:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to add record:", error);
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Medication"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      <div className="bg-white rounded-lg p-8 max-w-md mx-auto z-50">
        <h2 className="text-2xl mb-4">나의 약</h2>

        {/* 약 별명 입력 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="약 별명(최대 6자)"
            value={mediNickname}
            onChange={(e) => setMediNickname(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
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
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
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

        {/* 복용 기간 설정 */}
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              복용 시작일:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
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
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            />
          </div>
        </div>

        {/* 복용 시간 설정 */}
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

        {/* 알림 설정 */}
        <div className="flex items-center mb-4">
          <label className="flex items-center">
            <div
              onClick={() => setNotificationEnabled(!notificationEnabled)}
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
            <label className="block text-gray-700 text-sm font-bold mb-2">
              요일:
            </label>
            <div className="flex flex-wrap space-x-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
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

            <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
              알림 시간:
            </label>
            {notificationTime.map((time, index) => (
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
                    onClick={() =>
                      setNotificationTime(notificationTime.filter((_, i) => i !== index))
                    }
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
          <label className="block text-gray-700 text-sm font-bold mb-2">
            메모:
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="간단한 약 정보를 입력해주세요"
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none resize-none h-16"
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            추가
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddMediModal;
