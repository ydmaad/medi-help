import React, { useState, useEffect } from "react";
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

interface MobileAddMediProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newMediRecord: MediRecord) => void;
}

const MobileAddMedi: React.FC<MobileAddMediProps> = ({
  isOpen,
  onClose,
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
      repeat: false,
    };

    try {
      console.log("Sending medication data:", newMediRecord);
      const response = await axios.post("/api/calendar/medi", newMediRecord);
      console.log("Server response:", response.data);

      if (response.status === 201) {
        console.log("Medication added successfully");
        onAdd(newMediRecord);
        onClose();
      } else {
        console.error("Failed to add record:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to add record:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h2 className="text-2xl mb-4 text-brand-gray-800">나의 약</h2>
        
        {/* 약 별명 입력 */}
        <input
          type="text"
          placeholder="약 별명(최대 6자)"
          value={mediNickname}
          onChange={(e) => setMediNickname(e.target.value)}
          className="border rounded w-full py-2 px-3 mb-4 text-brand-gray-1000 leading-tight focus:outline-none"
        />

        {/* 약 이름 입력 */}
        <input
          list="mediNames"
          placeholder="약 이름을 검색하세요"
          value={mediName}
          onChange={(e) => {
            setMediName(e.target.value);
            setSearchTerm(e.target.value);
          }}
          className="border rounded w-full py-2 px-3 mb-4 text-brand-gray-1000 leading-tight focus:outline-none"
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

        {/* 복용 시간 설정 */}
        <div className="mb-4">
          <label className="block text-brand-gray-600 text-sm font-bold mb-2">
            나의 약 등록
          </label>
          <div className="flex space-x-4 text-brand-gray-800 justify-between w-full">
            {["morning", "afternoon", "evening"].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setTimes({ ...times, [time]: !times[time as keyof typeof times] })}
                className={`px-4 py-2 rounded-full ${
                  times[time as keyof typeof times]
                    ? "bg-brand-primary-500 text-white"
                    : "bg-brand-gray-50 text-brand-gray-800"
                } w-1/3`}
              >
                {time === "morning" ? "아침" : time === "afternoon" ? "점심" : "저녁"}
              </button>
            ))}
          </div>
        </div>

        {/* 복용 기간 설정 */}
        <div className="flex space-x-4 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none w-1/2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none w-1/2"
          />
        </div>

        {/* 알림 설정 */}
        <div className="flex items-center mb-4">
          <label className="flex items-center">
            <span className="mr-2 text-brand-gray-600">알림 설정</span>
            <div
              onClick={() => setNotificationEnabled(!notificationEnabled)}
              className={`relative w-12 h-6 flex items-center rounded-full cursor-pointer ${
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
          <div className="mb-4">
            <div className="flex flex-wrap space-x-2 mb-5">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setDayOfWeek(prevDays =>
                    prevDays.includes(day)
                      ? prevDays.filter(d => d !== day)
                      : [...prevDays, day]
                  )}
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
              <div key={index} className="flex mb-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    const updatedTimes = [...notificationTime];
                    updatedTimes[index] = e.target.value;
                    setNotificationTime(updatedTimes);
                  }}
                  className="border rounded w-full py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}

        {/* 메모 입력 */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="약에 대한 간단한 기록"
          className="border rounded w-full py-2 px-3 mb-4 text-brand-gray-800 leading-tight focus:outline-none resize-none h-16"
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          >
            취소
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-brand-primary-500 text-white rounded"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAddMedi;