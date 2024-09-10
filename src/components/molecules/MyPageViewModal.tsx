import React, { useState, useEffect } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { format, parse } from "date-fns";
import axios from "axios";
import { useToast } from "@/hooks/useToast";

const Switch: React.FC<{
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}> = ({ checked, onCheckedChange }) => {
  return (
    <div
      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer ${
        checked ? "bg-blue-500" : "bg-gray-300"
      }`}
      onClick={() => onCheckedChange(!checked)}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </div>
  );
};

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
  const [editedRecord, setEditedRecord] = useState<MediRecord>(mediRecord);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediNames, setMediNames] = useState<{ itemName: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setEditedRecord(mediRecord);
  }, [mediRecord]);

  useEffect(() => {
    fetchMediNames();
  }, []);

  const fetchMediNames = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/calendar/medi/names");
      setMediNames(response.data);
    } catch (error) {
      console.error("Error fetching medication names:", error);
      setError("약 이름을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "medi_nickname" && value.length > 6) {
      toast.error("약 별명은 최대 6글자입니다.");
      return;
    }
    setEditedRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (time: "morning" | "afternoon" | "evening") => {
    setEditedRecord((prev) => ({
      ...prev,
      times: { ...prev.times, [time]: !prev.times[time] },
    }));
  };

  const handleDayOfWeekChange = (day: string) => {
    setEditedRecord((prev) => ({
      ...prev,
      day_of_week: prev.day_of_week
        ? prev.day_of_week.includes(day)
          ? prev.day_of_week.filter((d) => d !== day)
          : [...prev.day_of_week, day]
        : [day],
    }));
  };
  const handleNotificationTimeChange = (index: number, value: string) => {
    setEditedRecord((prev) => ({
      ...prev,
      notification_time: prev.notification_time
        ? prev.notification_time.map((time, i) => (i === index ? value : time))
        : [value],
    }));
  };

  const addNotificationTime = () => {
    setEditedRecord((prev) => ({
      ...prev,
      notification_time: prev.notification_time
        ? [...prev.notification_time, ""]
        : [""],
    }));
  };

  const removeNotificationTime = (index: number) => {
    setEditedRecord((prev) => ({
      ...prev,
      notification_time: prev.notification_time
        ? prev.notification_time.filter((_, i) => i !== index)
        : [],
    }));
  };

  const validateForm = () => {
    if (!editedRecord.medi_nickname.trim()) {
      toast.error("약 별명을 입력해주세요.");
      return false;
    }
    if (!editedRecord.medi_name) {
      toast.error("약을 선택해주세요.");
      return false;
    }
    if (!editedRecord.start_date || !editedRecord.end_date) {
      toast.error("기간을 설정해주세요.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `/api/mypage/medi/${editedRecord.id}`,
        editedRecord
      );
      if (response.status === 200) {
        onUpdate(response.data);
        setIsEditing(false);
        toast.success("약 정보가 성공적으로 수정되었습니다.");
      }
    } catch (err) {
      setError("업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.");
      toast.error("약 정보 수정 중 오류가 발생했습니다.");
      console.error("Error updating medication:", err);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/mypage/medi/${mediRecord.id}`);
      if (response.status === 200) {
        onDelete(mediRecord.id);
        onClose();
        toast.success("약 정보가 삭제되었습니다.");
      }
    } catch (err) {
      setError("삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
      toast.error("약 정보 삭제 중 오류가 발생했습니다.");
      console.error("Error deleting medication:", err);
    }
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "yyyy.MM.dd");
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    const formattedTime = format(date, "a hh:mm");
    const isAM = format(date, "a") === "AM";
    return { time: formattedTime, isAM };
  };

  const TimeDisplay: React.FC<{ time: string }> = ({ time }) => {
    const { time: formattedTime, isAM } = formatTime(time);
    return (
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full ${isAM ? "bg-brand-primary-100" : "bg-brand-primary-500"}`}
        ></div>
        <span>{formattedTime}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-4 py-3">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-brand-gray-800 text-[18px] font-bold">
            나의 약 {isEditing ? "수정" : ""}
          </span>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="text-blue-500 hover:text-blue-700"
            >
              저장
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-brand-primary-500"
            >
              편집
            </button>
          )}
        </div>
        <div className="flex-grow p-4 space-y-4">
          {/* 약 정보 표시 */}
          {!isEditing && (
            <>
              <div className="text-brand-gray-800 text-[18px] font-bold">
                {mediRecord.medi_nickname}
              </div>
              <div className="text-brand-gray-800 text-[14px]">
                {mediRecord.medi_name}
              </div>
              <div className="flex items-center mt-2">
                <div className="text-[14px] text-brand-gray-800 mr-6">
                  복용 날짜
                </div>
                <div className="text-[14px] text-brand-gray-600">
                  {formatDate(mediRecord.start_date)} ~{" "}
                  {formatDate(mediRecord.end_date)}
                </div>
              </div>
              <div className="flex items-center mt-2">
                <div className="text-[14px] text-brand-gray-800 mr-4">
                  복용 시간대
                </div>
                <div className="flex space-x-2">
                  {mediRecord.times.morning && (
                    <div className="rounded-full bg-brand-primary-50 px-2 py-1">
                      <span className="text-[12px] text-brand-primary-500">
                        아침
                      </span>
                    </div>
                  )}
                  {mediRecord.times.afternoon && (
                    <div className="rounded-full bg-brand-primary-50 px-2 py-1">
                      <span className="text-[12px] text-brand-primary-500">
                        점심
                      </span>
                    </div>
                  )}
                  {mediRecord.times.evening && (
                    <div className="rounded-full bg-brand-primary-50 px-2 py-1">
                      <span className="text-[12px] text-brand-primary-500">
                        저녁
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-[auto,1fr] gap-x-4">
                <div className="text-[14px] text-brand-gray-800">복용 알람</div>
                <div>
                  <div className="text-[14px] text-brand-gray-1000 pl-4">
                    {mediRecord.day_of_week?.join(" ") ?? "설정된 요일 없음"}
                    요일
                  </div>
                  <div className="text-[14px] text-brand-gray-800 flex flex-wrap gap-2 pl-4 mt-1">
                    {mediRecord.notification_time?.map((time, index) => (
                      <TimeDisplay key={index} time={time} />
                    )) ?? <span>설정된 알람 시간 없음</span>}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-[14px] text-brand-gray-600 mb-3">메모</div>
                <div className="p-4 text-sm bg-brand-gray-50">
                  {mediRecord.notes ? (
                    <span className="text-brand-gray-800">
                      {mediRecord.notes}
                    </span>
                  ) : (
                    <span className="text-brand-gray-800 italic">
                      복약 후 몸 상태나 오늘 하루의 복약에 대한 한 마디를
                      적어보세요.
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* 편집 모드에서의 입력 폼 */}
          {isEditing && (
            <>
              <div className="mb-2">
                <input
                  type="text"
                  name="medi_nickname"
                  placeholder="약 별명(최대 6자)"
                  value={editedRecord.medi_nickname}
                  onChange={handleInputChange}
                  className="border rounded w-full h-[40px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
                />
              </div>

              <div className="mb-5">
                <select
                  name="medi_name"
                  value={editedRecord.medi_name}
                  onChange={handleInputChange}
                  className="border rounded w-full h-[40px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
                  disabled={isLoading}
                >
                  <option value="">약 이름 선택</option>
                  {isLoading ? (
                    <option value="" disabled>
                      로딩 중...
                    </option>
                  ) : (
                    mediNames.map((medi, index) => (
                      <option key={index} value={medi.itemName}>
                        {medi.itemName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-brand-gray-800">
                  복용 시간
                </label>
                <div className="flex items-center space-x-2">
                  {["morning", "afternoon", "evening"].map((time) => (
                    <button
                      key={time}
                      className={`border rounded px-2 py-1 ${editedRecord.times[time as keyof typeof editedRecord.times] ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
                      onClick={() =>
                        handleTimeChange(
                          time as "morning" | "afternoon" | "evening"
                        )
                      }
                    >
                      {time === "morning"
                        ? "아침"
                        : time === "afternoon"
                          ? "점심"
                          : "저녁"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-brand-gray-800">
                  복용 기간
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    name="start_date"
                    value={editedRecord.start_date}
                    onChange={handleInputChange}
                    className="border rounded w-full h-[40px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
                  />
                  <span>~</span>
                  <input
                    type="date"
                    name="end_date"
                    value={editedRecord.end_date}
                    onChange={handleInputChange}
                    className="border rounded w-full h-[40px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-5">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-brand-gray-800">
                    알람 설정
                  </label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editedRecord.repeat ?? false}
                      onCheckedChange={(checked) =>
                        setEditedRecord((prev) => ({
                          ...prev,
                          repeat: checked,
                        }))
                      }
                    />
                    <button
                      onClick={addNotificationTime}
                      className="text-blue-500 hover:text-blue-700"
                      disabled={!editedRecord.repeat}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
                {editedRecord.repeat && (
                  <>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-brand-gray-800">
                        요일 선택
                      </label>
                      <div className="flex items-center space-x-2">
                        {["월", "화", "수", "목", "금", "토", "일"].map(
                          (day) => (
                            <button
                              key={day}
                              className={`border rounded px-2 py-1 ${editedRecord.day_of_week?.includes(day) ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
                              onClick={() => handleDayOfWeekChange(day)}
                            >
                              {day}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-brand-gray-800">
                        알람 시간 설정
                      </label>
                      {editedRecord.notification_time?.map((time, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 mt-1"
                        >
                          <input
                            type="time"
                            value={time}
                            onChange={(e) =>
                              handleNotificationTimeChange(
                                index,
                                e.target.value
                              )
                            }
                            className="border rounded w-full h-[40px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
                          />
                          <button
                            onClick={() => removeNotificationTime(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            삭제
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-brand-gray-800">
                  메모
                </label>
                <textarea
                  name="notes"
                  value={editedRecord.notes}
                  onChange={handleInputChange}
                  className="border rounded w-full h-[80px] py-2 px-3 text-brand-gray-1000 leading-tight focus:outline-none"
                />
              </div>
            </>
          )}
        </div>
        {isEditing && (
          <div className="flex justify-between items-center px-4 py-3 border-t">
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              삭제
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPageViewModal;
