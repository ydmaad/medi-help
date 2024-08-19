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
  const [notificationTime, setNotificationTime] = useState("");
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

    if (editMode && editData) {
      setMediName(editData.medi_name);
      setMediNickname(editData.medi_nickname);
      setTimes(editData.times);
      setNotes(editData.notes);
      setStartDate(editData.start_date);
      setEndDate(editData.end_date);
      setDayOfWeek(editData.day_of_week);
      setNotificationTime(editData.notification_time[0] || "");
      setNotificationEnabled(editData.day_of_week.length > 0);
    }
  }, [editMode, editData]);

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
      notification_time: notificationEnabled ? [notificationTime] : [],
      repeat: false,
    };

    try {
      console.log("Sending medication data:", mediRecord);
      let response;
      if (editMode && editData) {
        response = await axios.put(`/api/mypage/medi/${editData.id}`, mediRecord);
      } else {
        response = await axios.post("/api/calendar/medi", mediRecord);
      }
      console.log("Server response:", response.data);

      if (response.status === 200 || response.status === 201) {
        console.log("Medication " + (editMode ? "updated" : "added") + " successfully");
        onAdd(response.data);
        onClose();
      } else {
        throw new Error("Failed to " + (editMode ? "update" : "add") + " record: " + response.statusText);
      }
    } catch (error) {
      console.error("Failed to " + (editMode ? "update" : "add") + " record:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white overflow-y-auto h-full w-full z-50">
      <div className="p-5">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onClose} className="text-2xl">
            <IoIosArrowBack />
          </button>
          <h2 className="text-2xl font-bold text-brand-gray-800">{editMode ? "나의 약 수정" : "나의 약"}</h2>
          {!editMode && <button onClick={() => onAdd(editData as MediRecord)} className="text-brand-primary-500">수정</button>}
        </div>

        {!editMode ? (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{mediNickname}</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-brand-gray-600">복용 날짜</span>
                <span className="text-sm text-brand-gray-600">{startDate} ~ {endDate}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">복용 시간대</span>
                <span className="text-sm text-brand-gray-600">
                  {Object.entries(times)
                    .filter(([_, value]) => value)
                    .map(([key, _]) => key === 'morning' ? '아침' : key === 'afternoon' ? '점심' : '저녁')
                    .join(', ')}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-sm font-medium">복용 알람</span>
              {notificationEnabled ? (
                <div className="mt-1">
                  <p className="text-sm text-brand-gray-600">{dayOfWeek.join(' ')}</p>
                  <p className="text-sm text-brand-gray-600">오전 {notificationTime}</p>
                </div>
              ) : (
                <p className="text-sm text-brand-gray-600 mt-1">알람 없음</p>
              )}
            </div>

            {notes && (
              <div className="mb-4">
                <span className="text-sm font-medium">메모</span>
                <div className="mt-1 p-3 bg-brand-gray-500 rounded-md text-sm text-white">
                  {notes}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="약 별명"
              value={mediNickname}
              onChange={(e) => setMediNickname(e.target.value)}
              className="border-b border-brand-gray-300 w-full py-2 mb-4 text-lg focus:outline-none focus:border-brand-primary-500"
            />

            <div className="relative mb-4">
              <select
                value={mediName}
                onChange={(e) => setMediName(e.target.value)}
                className="border-b border-brand-gray-300 w-full py-2 pr-8 text-lg focus:outline-none focus:border-brand-primary-500 appearance-none"
              >
                <option value="">약 이름을 선택하세요</option>
                {mediNames.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-gray-600 mb-2">복용 시간</label>
              <div className="flex justify-between w-full">
                {(['아침', '점심', '저녁'] as const).map((time, index) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setTimes(prevTimes => {
                      const key = Object.keys(prevTimes)[index] as keyof Times;
                      return { ...prevTimes, [key]: !prevTimes[key] };
                    })}
                    className={`px-4 py-2 rounded-full ${
                      times[Object.keys(times)[index] as keyof Times]
                        ? "bg-brand-primary-500 text-white"
                        : "border border-brand-gray-300 text-brand-gray-600"
                    } flex-1 mx-1`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-gray-600 mb-2">복용 기간</label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none focus:border-brand-primary-500 flex-1"
                />
                <span className="text-brand-gray-600">부터</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none focus:border-brand-primary-500 flex-1"
                />
                <span className="text-brand-gray-600">까지</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-brand-gray-600">알림 설정</span>
                <div
                  onClick={() => setNotificationEnabled(!notificationEnabled)}
                  className={`w-12 h-6 flex items-center rounded-full cursor-pointer ${
                    notificationEnabled ? "bg-brand-primary-400" : "bg-brand-gray-400"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      notificationEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  ></div>
                </div>
              </div>

              {notificationEnabled && (
                <>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setDayOfWeek(prevDays =>
                          prevDays.includes(day)
                            ? prevDays.filter(d => d !== day)
                            : [...prevDays, day]
                        )}
                        className={`px-3 py-1 rounded-full ${
                          dayOfWeek.includes(day)
                            ? "bg-brand-primary-500 text-white"
                            : "border border-brand-gray-300 text-brand-gray-600"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={notificationTime.split(':')[0]}
                      onChange={(e) => setNotificationTime(`${e.target.value}:${notificationTime.split(':')[1] || '00'}`)}
                      className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none focus:border-brand-primary-500"
                    >
                      {[...Array(24)].map((_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                    <span>:</span>
                    <select
                      value={notificationTime.split(':')[1]}
                      onChange={(e) => setNotificationTime(`${notificationTime.split(':')[0] || '00'}:${e.target.value}`)}
                      className="border rounded py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none focus:border-brand-primary-500"
                    >
                      {[...Array(60)].map((_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-gray-600 mb-2">메모</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="약에 대한 간단한 기록"
                className="border rounded w-full py-2 px-3 text-brand-gray-800 leading-tight focus:outline-none focus:border-brand-primary-500 resize-none h-24"
              />
            </div>
          </>
        )}

        <div className="flex justify-center mt-4">
          {editMode ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-brand-primary-500 text-white rounded-full w-full"
            >
              저장
            </button>
          ) : (
            <button
              onClick={() => {/* 삭제 로직 */}}
              className="px-6 py-2 bg-red-500 text-white rounded-full w-full"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileAddMedi;