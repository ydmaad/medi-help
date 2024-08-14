// src/components/templates/mypage/UserBoard.tsx

"use client";

import { useAuthStore } from "@/store/auth";
import React from "react";
import { TbPencil } from "react-icons/tb";

interface UserBoardProps {
  className?: string;
}

const UserBoard: React.FC<UserBoardProps> = ({ className }) => {
  const { user } = useAuthStore();

  return (
    <div
      className={`flex flex-col items-center w-full p-6 bg-[#e9f5fe] rounded-xl ${className}`}
    >
      <div className="w-24 h-24 desktop:w-60 desktop:h-60 rounded-full overflow-hidden mb-4">
        <img
          src={user?.avatar ? user.avatar : "/default-avatar.jpg"}
          alt="프로필 이미지"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="text-2xl desktop:text-4xl font-bold text-primary-500 mb-2">
          {user?.nickname}님
        </div>
        <div className="text-lg desktop:text-xl text-gray-800 mb-6">
          {user?.email}
        </div>
        <button className="w-full max-w-[240px] py-3 flex items-center justify-center gap-2 bg-[#279ef9] text-[#f5f6f7] rounded-xl cursor-pointer hover:bg-[#1e7fe0] ease-in duration-300">
          <TbPencil className="text-2xl" />
          프로필 수정
        </button>
      </div>
    </div>
  );
};

export default UserBoard;