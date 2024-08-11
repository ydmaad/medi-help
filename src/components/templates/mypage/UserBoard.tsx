"use client";
import { useAuthStore } from "@/store/auth";
import React from "react";
import { TbPencil } from "react-icons/tb";

interface UserBoardProps {
  className?: string; // className prop 추가
}

const UserBoard: React.FC<UserBoardProps> = ({ className }) => {
  const { user } = useAuthStore();

  return (
    <div className={`flex flex-col items-center w-full md:w-1/2 lg:w-1/3 p-8 bg-blue-50 rounded-xl text-blue-500 justify-center ${className}`}>
      <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6">
        <img
          src={user?.avatar ? user.avatar : "/default-avatar.jpg"}
          alt="프로필 이미지"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold">
          {user?.nickname}님
        </div>
        <div className="text-lg">{user?.email}</div>
        <button className="w-full min-w-36 py-2 mt-4 flex items-center justify-center gap-2 bg-blue-500 text-white rounded-sm cursor-pointer hover:bg-blue-700 ease-in duration-300">
          <TbPencil className="text-2xl" />
          프로필 수정
        </button>
      </div>
    </div>
  );
};

export default UserBoard;
