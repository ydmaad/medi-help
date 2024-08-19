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

const CalendarMedi: React.FC<{ onAdd: (newMediRecord: MediRecord) => void }> = ({ onAdd }) => {
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
        setMediNames(response.data.map((item: { itemName: string }) => item.itemName));
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
      } else {
        console.error("Failed to add record:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to add record:", error);
    }
  };

  const handleDayOfWeekChange = (day: string) => {
    setDayOfWeek((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  const handleNotificationTimeChange = (index: number, value: string) => {
    const updatedNotificationTime = [...notificationTime];
    updatedNotificationTime[index] = value;
    setNotificationTime(updatedNotificationTime);
  };

  return (
    <div className="bg-white p-4 max-w-sm mx-auto my-4 rounded shadow-lg">
      <h2 className="text-2xl mb-4">약 등록</h2>

      {/* 약 별명 입력 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="약 별명(최대 6자)"
          value={mediNickname}
          onChange={(e) => setMediNickname(e.target.value)}
          className="border rounded w-full py-2 px-3"
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
          className="border rounded w-full py-2 px-3"
        />
        <datalist id="mediNames">
          {mediNames
            .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((name, index) => (
              <option key={index} value={name} />
            ))}
        </datalist>
      </div>

      {/* 복용 시간 설정 */}
      <div className="mb-4">
        <label className="block mb-2">복용 시간</label>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setTimes({ ...times, morning: !times.morning })}
            className={`px-4 py-2 rounded ${times.morning ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            아침
          </button>
          <button
            type="button"
            onClick={() => setTimes({ ...times, afternoon: !times.afternoon })}
            className={`px-4 py-2 rounded ${times.afternoon ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            점심
          </button>
          <button
            type="button"
            onClick={() => setTimes({ ...times, evening: !times.evening })}
            className={`px-4 py-2 rounded ${times.evening ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            저녁
          </button>
        </div>
      </div>

      {/* 복용 기간 설정 */}
      <div className="flex space-x-2 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded py-2 px-3 w-1/2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded py-2 px-3 w-1/2"
        />
      </div>

      {/* 알림 설정 */}
      <div className="mb-4 flex items-center">
        <label className="mr-2">알림 설정</label>
        <input
          type="checkbox"
          checked={notificationEnabled}
          onChange={() => setNotificationEnabled(!notificationEnabled)}
        />
      </div>

      {notificationEnabled && (
        <div className="mb-4">
          <div className="flex space-x-2 mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayOfWeekChange(day)}
                className={`px-4 py-2 rounded ${dayOfWeek.includes(day) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                {day}
              </button>
            ))}
          </div>

          {notificationTime.map((time, index) => (
            <input
              key={index}
              type="time"
              value={time}
              onChange={(e) => handleNotificationTimeChange(index, e.target.value)}
              className="border rounded py-2 px-3 mb-2 w-full"
            />
          ))}
        </div>
      )}

      {/* 메모 입력 */}
      <div className="mb-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="약에 대한 간단한 기록"
          className="border rounded w-full py-2 px-3 h-24 resize-none"
        />
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="px-6 py-2 bg-blue-500 text-white rounded w-full"
      >
        저장
      </button>
    </div>
  );
};

export default CalendarMedi;
