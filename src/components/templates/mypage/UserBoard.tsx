"use client";
import { useAuthStore } from "@/store/auth";
import React, { useState } from "react";
import { TbPencil } from "react-icons/tb";

type userInfoType = {
  avatar: string;
  created_at: string;
  email: string;
  id: string;
  nickname: string;
};

const UserBoard = () => {
  const { user } = useAuthStore();

  return (
    <>
      <div className="flex items-center justify-center gap-8 my-24">
        <div className="relative w-36 h-36 rounded-full overflow-hidden aspect-auto">
          <img
            src={user?.avatar ? user.avatar : "/default-avatar.jpg"}
            alt=""
            className="w-full h-full absolute z-10"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-bold text-brand-gray-1000">
            {user?.nickname}
          </div>
          <div className="text-sm text-brand-gray-400">{user?.email}</div>
          <button className="w-full min-w-36 py-1 flex items-center justify-center gap-2 bg-brand-primary-50 text-brand-primary-500 rounded-sm cursor-pointer hover:bg-brand-primary-500 hover:text-white ease-in duration-300">
            <TbPencil className="text-xl" />
            프로필 수정
          </button>
        </div>
      </div>
    </>
  );
};

export default UserBoard;
