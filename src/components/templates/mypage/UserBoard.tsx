"use client";

import { AuthUser, useAuthStore } from "@/store/auth";
import React, { useState, useEffect } from "react";
import { TbPencil } from "react-icons/tb";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";

interface UserBoardProps {
  className?: string;
}

const UserBoard: React.FC<UserBoardProps> = ({ className }) => {
  const [isEditMode, setEditMode] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (user) {
      setNewNickname(user.nickname || "");
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setNewAvatar(null);
    setAvatarPreview(null);
    setNewNickname(user?.nickname || "");
  };

  const editProfile = async () => {
    if (!user) return;
  
    try {
      let avatarUrl = user.avatar;
  
      if (newAvatar) {
        const fileName = `avatar_${user.id}_${Date.now()}`;
        const { data: imgUploadData, error: imgUploadError } = await supabase.storage
          .from("avatars") // "posts_image_url" 대신 "avatars" 사용
          .upload(fileName, newAvatar);
  
        if (imgUploadError) throw imgUploadError;
  
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);
  
        avatarUrl = urlData?.publicUrl;
      }
  
      const { error: updateError } = await supabase
        .from("users") // "user" 대신 "users" 사용
        .update({ nickname: newNickname, avatar: avatarUrl })
        .eq("id", user.id);
  
      if (updateError) throw updateError;
  
      setUser({ ...user, nickname: newNickname, avatar: avatarUrl } as AuthUser);
      setEditMode(false);
    } catch (error) {
      console.error("프로필 업데이트 에러", error);
      alert("프로필 업데이트에 실패했습니다.");
    }
  };
  
  

  if (!user) return null;

  return (
    <div
      className={`flex flex-col items-center w-full p-6 rounded-xl text-primary-500 justify-center border-[2px] ${className} ${
        isEditMode ? "bg-[#ffffff] border-[#6EBEFB]" : "bg-[#e9f5fe]"
      }`}
    >
      {isEditMode ? (
        <div className="flex flex-col items-center w-full">
          <div className="relative w-60 h-60 rounded-full mb-8">
            <Image
              src={avatarPreview || user.avatar || "/default-avatar.jpg"}
              alt="프로필 이미지"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
            <div className="absolute right-0 bottom-0 bg-[#40444C] rounded-full w-[80px] h-[80px] flex justify-center items-center">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <TbPencil className="text-[36px] text-[#ffffff]" />
              </label>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                onChange={handleAvatarChange}
                accept="image/*"
              />
            </div>
          </div>
          <div className="flex flex-col items-center w-full max-w-md">
            <input
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="border border-[#E0E2E4] px-5 py-3 rounded-[4px] mb-8 w-full text-center"
              placeholder="새 닉네임 입력"
            />
            <div className="flex justify-between items-center gap-4 w-full">
              <button
                className="w-full py-3 flex items-center justify-center gap-2 bg-[#E9F5FE] text-[#279ef9] rounded-[4px] cursor-pointer"
                onClick={handleCancelEdit}
              >
                취소
              </button>
              <button
                className="w-full py-3 flex items-center justify-center gap-2 bg-[#279ef9] text-[#f5f6f7] rounded-[4px] cursor-pointer"
                onClick={editProfile}
              >
                저장
              </button>
            </div>
          </div>
        </div>
       ) : (
        <div className="flex flex-row desktop:flex-col items-center w-full">
          <div className="relative w-32 h-32 desktop:w-48 desktop:h-48 rounded-full overflow-visible mb-0 desktop:mb-6 mr-4 desktop:mr-0">
            <Image
              src={user.avatar || "/default-avatar.jpg"}
              alt="프로필 이미지"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
            <button
              className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#279ef9] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1e7fe0] ease-in duration-300 desktop:hidden shadow-md"
              onClick={() => setEditMode(true)}
            >
              <TbPencil className="text-2xl text-white" />
            </button>
          </div>
          <div className="flex flex-col items-start desktop:items-center">
            <div className="text-xl desktop:text-4xl font-bold text-primary-500 mb-1 desktop:mb-2">
              {user.nickname}님
            </div>
            <div className="text-base desktop:text-xl text-gray-800 desktop:mb-6">
              {user.email}
            </div>
            <button
              className="hidden desktop:flex w-full max-w-[300px] mt-4 py-3 items-center justify-center gap-2 bg-[#279ef9] text-[#f5f6f7] rounded-[4px] cursor-pointer hover:bg-[#1e7fe0] ease-in duration-300"
              onClick={() => setEditMode(true)}
            >
              <TbPencil className="text-2xl" />
              프로필 수정
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBoard;