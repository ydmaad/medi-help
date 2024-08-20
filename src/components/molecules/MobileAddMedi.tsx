import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { IoIosArrowBack } from 'react-icons/io';

interface MediRecord {
  id: string;
  medi_name: string;
  medi_nickname: string;
  times: Times;
  notes: string;
  start_date: string;
  end_date: string;
  created_at: string;
  user_id: string;
  day_of_week: string[];
  notification_time: string[];
  repeat: boolean;
}

interface Times {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
}

interface MobileAddMediProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newMediRecord: MediRecord) => void;
  editMode?: boolean;
  editData?: MediRecord;
}

const MobileAddMedi: React.FC<MobileAddMediProps> = ({
  isOpen,
  onClose,
  onAdd,
  editMode = false,
  editData,
}) => {
  const { user } = useAuthStore();
  const [mediName, setMediName] = useState("");
  const [mediNickname, setMediNickname] = useState("");
  const [mediNames, setMediNames] = useState<string[]>([]);
  const [times, setTimes] = useState<Times>({
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
  const [searchTerm, setSearchTerm] = useState("");

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

    if (editMode && editData) {
      setMediName(editData.medi_name);
      setMediNickname(editData.medi_nickname);
      setTimes(editData.times);
      setNotes(editData.notes);
      setStartDate(editData.start_date);
      setEndDate(editData.end_date);
      setDayOfWeek(editData.day_of_week);
      setNotificationTime(editData.notification_time);
      setNotificationEnabled(editData.day_of_week.length > 0);
    }
  }, [editMode, editData]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onClose]);

  const handleSubmit = async () => {
    if (!user) return;

    const mediRecord: MediRecord = {
      id: editMode && editData ? editData.id : crypto.randomUUID(),
      medi_name: mediName,
      medi_nickname: mediNickname,
      times,
      notes,
      start_date: startDate,
      end_date: endDate,
      created_at: editMode && editData ? editData.created_at : new Date().toISOString(),
      user_id: user.id,
      day_of_week: notificationEnabled ? dayOfWeek : [],
      notification_time: notificationEnabled ? notificationTime : [],
      repeat: false,
    };

    try {
      let response;
      if (editMode && editData) {
        response = await axios.put(`/api/mypage/medi/${editData.id}`, mediRecord);
      } else {
        response = await axios.post("/api/calendar/medi", mediRecord);
      }

      if (response.status === 200 || response.status === 201) {
        onAdd(response.data);
        onClose();
      } else {
        throw new Error("Failed to " + (editMode ? "update" : "add") + " record: " + response.statusText);
      }
    } catch (error) {
      console.error("Failed to " + (editMode ? "update" : "add") + " record:", error);
    }
  };

  const handleDayOfWeekChange = (day: string) => {
    setDayOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleNotificationTimeChange = (index: number, value: string) => {
    setNotificationTime((prev) => {
      const newTimes = [...prev];
      newTimes[index] = value;
      return newTimes;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white overflow-y-auto w-full z-50 flex flex-col">
      <div className="w-full bg-white fixed top-0 left-0 flex justify-between items-center px-4 py-3 shadow-md">
        <button onClick={onClose} className="text-2xl">
          <IoIosArrowBack />
        </button>
        <h2 className="text-xl font-bold flex-1 text-center">나의 약 등록</h2>
        <button
          type="button"
          onClick={handleSubmit}
          className="text-brand-primary-500 font-semibold"
        >
          저장
        </button>
      </div>
      <div className="w-full mt-16 px-4 py-4 flex flex-col items-center">
        <div className="mb-4 w-full max-w-xs">
          <input
            type="text"
            placeholder="약 별명(최대 6자)"
            value={mediNickname}
            onChange={(e) => setMediNickname(e.target.value)}
            className="border rounded w-full h-[48px] px-4 py-3 text-brand-gray-1000 leading-tight focus:outline-none"
          />
        </div>

        <div className="mb-4 w-full max-w-xs">
          <input
            list="mediNames"
            placeholder="약 이름을 검색하세요"
            value={mediName}
            onChange={(e) => {
              setMediName(e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="border rounded w-full h-[48px] px-4 py-3 text-brand-gray-1000 leading-tight focus:outline-none"
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

        <div className="mb-6 w-full max-w-xs">
          <label className="block text-brand-gray-600 text-sm font-bold mb-2">복용 시간</label>
          <div className="flex space-x-2 text-brand-gray-800 justify-between">
            <button
              type="button"
              onClick={() => setTimes({ ...times, morning: !times.morning })}
              className={`px-4 py-2 rounded-full ${
                times.morning
                  ? "bg-brand-primary-500 text-white"
                  : "bg-brand-gray-50 text-brand-gray-800"
              } text-[14px]`}
              style={{ width: "106px", height: "40px" }}
            >
              아침
            </button>
            <button
              type="button"
              onClick={() => setTimes({ ...times, afternoon: !times.afternoon })}
              className={`px-4 py-2 rounded-full ${
                times.afternoon
                  ? "bg-brand-primary-500 text-white"
                  : "bg-brand-gray-50 text-brand-gray-800"
              } text-[14px]`}
              style={{ width: "106px", height: "40px" }}
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
              } text-[14px]`}
              style={{ width: "106px", height: "40px" }}
            >
              저녁
            </button>
          </div>
        </div>

        <div className="mb-6 flex w-full max-w-xs items-center justify-between">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded w-[96px] h-[28px] py-2 px-2 text-brand-gray-800 leading-tight"
          />
          <span className="text-brand-gray-800" style={{ fontSize: "16px" }}>부터</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded w-[96px] h-[28px] py-2 px-2 text-brand-gray-800 leading-tight"
          />
          <span className="text-brand-gray-800" style={{ fontSize: "16px" }}>까지</span>
        </div>

        {/* 알림 설정 */}
        <div className="flex items-center mb-6 w-full max-w-xs">
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
          <div className="mb-6 w-full max-w-xs">
            <div className="flex justify-between w-full mb-4">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayOfWeekChange(day)}
                  className={`px-2 py-1 items-center justify-center rounded-full ${
                    dayOfWeek.includes(day)
                      ? "bg-brand-primary-500 text-white"
                      : "bg-brand-gray-50 text-brand-gray-800"
                  } text-[14px]`}
                  style={{ flex: "1", margin: "0 2px" }}
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
                  onChange={(e) =>
                    handleNotificationTimeChange(index, e.target.value)
                  }
                  className="border rounded w-full py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}

        {/* 메모 입력 */}
        <div className="mb-6 w-full max-w-xs">
          <label className="block text-brand-gray-600 text-sm font-bold mb-2">메모:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="약에 대한 간단한 메모를 남겨주세요."
            className="border rounded w-full h-[160px] py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none resize-none"
          />
        </div>

        <div className="w-full max-w-xs flex justify-center mt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-brand-primary-500 text-white rounded w-full"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAddMedi;
