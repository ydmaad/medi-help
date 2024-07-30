"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Props {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  calendarId: string;
}

const AddModal = ({ openModal, setOpenModal, calendarId }: Props) => {
  const router = useRouter();

  const [values, setValues] = useState<test_calendar>({
    name: "",
    user_id: "test@test.com",
    medi_time: "",
    sideEffect: "",
    time: "2024-07-25 00:00:00+00",
  });

  // Route Handler 통해서 POST 하는 함수
  const postCalendar = async (value: test_calendar) => {
    try {
      const res = await axios.post("/api/test_calendar", value);
      console.log(res);
      return res;
    } catch (error) {
      console.log("Post Error", error);
    }
  };

  // Route Handler 통해서 UPDATE 하는 함수
  const updateCalendar = async (id: string, value: test_calendar) => {
    try {
      const res = await axios.patch(`/api/test_calendar/${id}`, value);
      console.log(res);
      return res;
    } catch (error) {
      console.log("Patch Error", error);
    }
  };

  // Route Handler 통해서 DELETE 하는 함수
  const deleteCalendar = async (id: string) => {
    try {
      const res = await axios.delete(`/api/test_calendar/${id}`);
      console.log(res);
      return res;
    } catch (error) {
      console.log("Delete Error", error);
    }
  };

  // Input 값 OnChange 함수
  const handleContentChange = (
    event:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
    console.log(values);
  };

  // 추가하기 버튼 onClick 함수
  const handleAddButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    postCalendar(values);
  };

  // 수정하기 버튼 onClick 함수
  const handleUpdateButtonClick = () => {
    updateCalendar(calendarId, values);
    setOpenModal(false);
  };

  // 삭제하기 버튼 onClick 함수
  const handleDeleteButtonClick = () => {
    deleteCalendar(calendarId);
    setOpenModal(false);
  };

  return (
    <div
      className={`absolute w-full h-full min-h-screen bg-black/[0.6] pt-32 flex justify-center z-10 backdrop-blur-sm ${
        openModal ? "block" : "hidden"
      }`}
    >
      <div className="sticky w-2/6 h-4/6 my-0 mx-auto bg-[#F8FBFE] rounded-lg z-20 drop-shadow-xl ">
        <div className="flex align-items p-4 gap-2">
          <button
            onClick={() => setOpenModal(false)}
            className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center text-xs text-red-500 hover:text-black"
          >
            x
          </button>
        </div>
        <div className="w-full h-4/6 px-8 py-2 flex flex-col gap-3">
          {/* 작은 타이틀 atom화하기 */}
          <div className="w-full text-sm text-gray-500 ">약 이름</div>
          <select
            name="name"
            value={values.name}
            onChange={handleContentChange}
            className="w-full py-2 outline-0 rounded-md border border-gray-500 drop-shadow-md "
          >
            <option value="아스피린">아스피린</option>
            <option value="이브프로펜">이브프로펜</option>
            <option value="머시론">머시론</option>
          </select>
          <div className="w-full text-sm text-gray-500 ">복용 시간</div>
          <select
            name="medi_time"
            value={values.medi_time}
            onChange={handleContentChange}
            className="w-full py-2 outline-0 rounded-md border border-gray-500 drop-shadow-md"
          >
            <option value="아침 복용">아침 복용</option>
            <option value="점심 복용">점심 복용</option>
            <option value="저녁 복용">저녁 복용</option>
          </select>
          <div className="w-full text-sm text-gray-500 ">부작용 기입하기</div>
          <textarea
            name="sideEffect"
            value={values.sideEffect}
            onChange={handleContentChange}
            placeholder="오늘 느꼈던 부작용을 기록해두세요!"
            className="w-full h-3/5 p-2 rounded-md border border-gray-500 drop-shadow-md"
          ></textarea>
        </div>
        <div className="h-1/4 flex place-items-center">
          <button
            onClick={handleAddButtonClick}
            className={`${
              calendarId ? "hidden" : "block"
            } w-4/12 h-4/12 min-w-24 min-h-10 border border-gray-400 bg-gray-200 m-auto rounded-lg drop-shadow-md hover:scale-105 ease-in duration-300`}
          >
            추가하기
          </button>
          <div
            className={`${
              calendarId ? "block" : "hidden"
            } w-full flex items-center justify-center gap-4`}
          >
            <button
              onClick={handleUpdateButtonClick}
              className={` w-4/12 h-4/12 min-w-24 min-h-10 border border-gray-400 bg-gray-200 my-auto rounded-lg drop-shadow-md hover:scale-105 ease-in duration-300`}
            >
              수정하기
            </button>
            <button
              onClick={handleDeleteButtonClick}
              className={` w-4/12 h-4/12 min-w-24 min-h-10 border border-gray-400 bg-gray-200 my-auto rounded-lg drop-shadow-md hover:scale-105 ease-in duration-300`}
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddModal;