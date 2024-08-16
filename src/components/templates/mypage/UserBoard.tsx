"use client";

import { AuthUser, useAuthStore } from "@/store/auth";
import React, { useState, useEffect } from "react";
import { TbPencil, TbCamera } from "react-icons/tb";
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

  const defaultAvatarPath = "/default-avatar.jpg";

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
    <div className={`${className} w-full h-full`}>
      {/* 데스크탑 버전 */}
      <div className="hidden desktop:flex h-full">
        <div className="w-[301px] h-full perspective-1000">
          <div
            className={`relative w-full h-full transition-transform duration-500 ${
              isEditMode ? "my-rotate-y-180" : ""
            } preserve-3d`}
          >
            {/* 프로필 카드 (앞면) */}
            <div className="absolute backface-hidden w-full h-full">
              <div className="bg-[#e9f5fe] rounded-xl border-[2px] border-transparent w-full h-full flex flex-col items-center justify-center p-6">
                <div className="relative w-[120px] h-[120px] rounded-full mb-4">
                  <Image
                    src={user.avatar || defaultAvatarPath}
                    alt="프로필 이미지"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div className="text-xl font-bold text-primary-500 mb-1">
                  {user.nickname}
                </div>
                <div className="text-sm text-gray-600 mb-4">{user.email}</div>
                <button
                  className="mt-2 w-full py-2 bg-[#279ef9] text-white rounded-md cursor-pointer text-sm flex items-center justify-center"
                  onClick={() => setEditMode(true)}
                >
                  <TbPencil className="mr-2" />
                  프로필 수정
                </button>
              </div>
            </div>

            {/* 프로필 수정 카드 (뒷면) */}
            <div className="absolute top-0 left-0 w-full h-full my-rotate-y-180 backface-hidden">
              <div className="bg-white rounded-xl border-[2px] border-[#6EBEFB] w-full h-full flex flex-col items-center justify-center p-6">
                <div className="relative w-[120px] h-[120px] rounded-full mb-4">
                  <Image
                    src={avatarPreview || user.avatar || defaultAvatarPath}
                    alt="프로필 이미지"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-[#279ef9] rounded-full p-2 cursor-pointer"
                  >
                    <TbCamera className="text-white text-xl" />
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    onChange={handleAvatarChange}
                    accept="image/*"
                  />
                </div>
                <input
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="border border-[#e0e2e4] px-3 py-2 rounded-md mb-4 w-full text-center"
                  placeholder="새 닉네임 입력"
                />
                <div className="text-sm text-green-500 mb-4">
                  사용 가능한 닉네임입니다.
                </div>
                <div className="flex justify-between items-center gap-2 w-full">
                  <button
                    className="w-full py-2 bg-[#e9f5fe] text-[#279ef9] rounded-md cursor-pointer text-sm"
                    onClick={handleCancelEdit}
                  >
                    취소
                  </button>
                  <button
                    className="w-full py-2 bg-[#279ef9] text-white rounded-md cursor-pointer text-sm"
                    onClick={editProfile}
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 버전 */}
      <div className="desktop:hidden w-full">
        <div className="bg-[#e9f5fe] rounded-xl border-[2px] border-transparent w-full p-4">
          {!isEditMode ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative w-[80px] h-[80px] rounded-full">
                  <Image
                    src={user.avatar || defaultAvatarPath}
                    alt="프로필 이미지"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <div className="text-[16px] font-bold text-primary-500">
                    {user.nickname}
                  </div>
                  <div className="text-[12px] text-gray-600 mt-1">
                    {user.email}
                  </div>
                </div>
              </div>
              <button
                className="w-[28px] h-[28px] bg-[#279ef9] rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setEditMode(true)}
              >
                <TbPencil className="text-white w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-[120px] h-[120px] rounded-full mb-4">
                <Image
                  src={avatarPreview || user.avatar || defaultAvatarPath}
                  alt="프로필 이미지"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
                <label
                  htmlFor="mobile-avatar-upload"
                  className="absolute bottom-0 right-0 bg-[#279ef9] rounded-full p-2 cursor-pointer"
                >
                  <TbCamera className="text-white text-xl" />
                </label>
                <input
                  type="file"
                  id="mobile-avatar-upload"
                  className="hidden"
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
              </div>
              <input
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                className="border border-[#e0e2e4] px-3 py-2 rounded-md mb-4 w-full text-center"
                placeholder="새 닉네임 입력"
              />
              <div className="flex justify-between items-center gap-2 w-full">
                <button
                  className="w-full py-2 bg-[#e9f5fe] text-[#279ef9] rounded-md cursor-pointer text-sm"
                  onClick={handleCancelEdit}
                >
                  취소
                </button>
                <button
                  className="w-full py-2 bg-[#279ef9] text-white rounded-md cursor-pointer text-sm"
                  onClick={editProfile}
                >
                  저장
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBoard;