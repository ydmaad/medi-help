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
    <div className="fixed inset-0 bg-white overflow-y-auto h-full w-full z-50">
      <div className="p-5">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onClose} className="text-2xl">
            <IoIosArrowBack />
          </button>
          <h2 className="text-xl font-bold">{editMode ? "Edit Medication" : "Add Medication"}</h2>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="약 별명(최대 6자)"
            value={mediNickname}
            onChange={(e) => setMediNickname(e.target.value)}
            className="border rounded w-full py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
          />
        </div>

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

        <div className="mb-4">
          <label className="block text-brand-gray-600 text-sm font-bold mb-2">복용 시간</label>
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
              onClick={() => setTimes({ ...times, afternoon: !times.afternoon })}
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

        <div className="flex space-x-4 mb-4">
          <div className="w-1/2 flex items-center">
            <div className="flex items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none w-3/4"
              />
              <span className="ml-3 text-brand-gray-800">부터</span>
            </div>
          </div>
          <div className="w-1/2 flex items-center">
            <div className="flex items-center">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none w-3/4"
              />
              <span className="ml-3 text-brand-gray-800">까지</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={notificationEnabled}
              onChange={(e) => setNotificationEnabled(e.target.checked)}
              className="mr-2"
            />
            <label className="text-brand-gray-800 text-sm font-bold">알림 설정</label>
          </div>
          {notificationEnabled && (
            <div className="mt-2">
              {notificationTime.map((time, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleNotificationTimeChange(index, e.target.value)}
                    className="border rounded py-2 px-3 text-brand-gray-800 leading-tight w-full"
                  />
                  {index === notificationTime.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setNotificationTime([...notificationTime, ""])}
                      className="ml-2 text-brand-primary-500"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center mb-4">
          <label className="block text-brand-gray-600 text-sm font-bold mb-2 mr-2">요일</label>
          <div className="flex space-x-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <button
                key={day}
                onClick={() => handleDayOfWeekChange(day)}
                className={`px-3 py-1 rounded ${
                  dayOfWeek.includes(day)
                    ? "bg-brand-primary-500 text-white"
                    : "bg-brand-gray-50 text-brand-gray-800"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <textarea
            placeholder="메모를 입력하세요"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border rounded w-full py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-brand-primary-500 text-white px-4 py-2 rounded"
          >
            {editMode ? "수정하기" : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAddMedi;
