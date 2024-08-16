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
        const { data: imgUploadData, error: imgUploadError } =
          await supabase.storage.from("avatars").upload(fileName, newAvatar);

        if (imgUploadError) throw imgUploadError;

        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = urlData?.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({ nickname: newNickname, avatar: avatarUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setUser({
        ...user,
        nickname: newNickname,
        avatar: avatarUrl,
      } as AuthUser);
      setEditMode(false);
    } catch (error) {
      console.error("프로필 업데이트 에러", error);
      alert("프로필 업데이트에 실패했습니다.");
    }
  };

  if (!user) return null;

  return (
    <div
      className={`flex items-center justify-center border-[2px] rounded-xl text-primary-500 ${className} ${
        isEditMode ? "bg-[#ffffff] border-[#6EBEFB]" : "bg-[#e9f5fe]"
      } desktop:w-[301px] desktop:h-[352px] w-full desktop:p-6 p-4`}
      style={{
        aspectRatio: '335 / 128',
      }}
    >
      {isEditMode ? (
        <div className="flex flex-col items-center w-full">
          <div className="relative w-[120px] h-[120px] rounded-full mb-4">
            <Image
              src={avatarPreview || user.avatar || "/default-avatar.jpg"}
              alt="프로필 이미지"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
            <div className="absolute right-0 bottom-0 bg-[#40444C] rounded-full w-[40px] h-[40px] flex justify-center items-center">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <TbPencil className="text-[20px] text-[#ffffff]" />
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
          <div className="flex flex-col items-center w-[180px]">
            <input
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="border border-[#E0E2E4] px-3 py-2 rounded-[4px] mb-4 w-full text-center"
              placeholder="새 닉네임 입력"
            />
            <div className="flex justify-between items-center gap-2 w-full">
              <button
                className="w-full py-2 flex items-center justify-center gap-1 bg-[#E9F5FE] text-[#279ef9] rounded-[4px] cursor-pointer text-sm"
                onClick={handleCancelEdit}
              >
                취소
              </button>
              <button
                className="w-full py-2 flex items-center justify-center gap-1 bg-[#279ef9] text-[#f5f6f7] rounded-[4px] cursor-pointer text-sm"
                onClick={editProfile}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 웹 사이즈 레이아웃 */}
          <div className="hidden desktop:flex flex-col items-center w-full">
            <div className="relative w-[120px] h-[120px] rounded-full mb-4">
              <Image
                src={user.avatar || "/default-avatar.jpg"}
                alt="프로필 이미지"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col items-center w-[180px]">
              <div className="text-xl font-bold text-primary-500 mb-1 text-center">
                {user.nickname}님
              </div>
              <div className="text-sm text-gray-800 mb-4 text-center">
                {user.email}
              </div>
              <button
                className="mt-5 w-[253px] h-[40px] flex items-center justify-center gap-2 bg-[#279ef9] text-[#f5f6f7] rounded-[4px] cursor-pointer hover:bg-[#1e7fe0] ease-in duration-300 text-sm"
                onClick={() => setEditMode(true)}
              >
                <TbPencil className="text-xl" />
                프로필 수정
              </button>
            </div>
          </div>

        
          {/* 모바일 사이즈 레이아웃 */}
          <div className="flex desktop:hidden items-center justify-center w-full h-full">
            <div className="flex items-center justify-center w-full max-w-[335px]">
              <div className="relative w-[80px] h-[80px]">
                <Image
                  src={user.avatar || "/default-avatar.jpg"}
                  alt="프로필 이미지"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
                <button
                  className="absolute -bottom-1 -right-1 w-[28px] h-[28px] bg-[#279ef9] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1e7fe0] ease-in duration-300"
                  onClick={() => setEditMode(true)}
                >
                  <TbPencil className="text-white w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col ml-4" style={{ width: '154px' }}>
                <div className="text-[16px] font-bold text-primary-500 truncate">
                  {user.nickname}님
                </div>
                <div className="text-[12px] text-gray-800 truncate mt-1">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserBoard;