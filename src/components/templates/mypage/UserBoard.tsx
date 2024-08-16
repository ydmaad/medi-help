// src/components/templates/mypage/UserBoard.tsx
"use client";

import { AuthUser, useAuthStore } from "@/store/auth";
import React, { useEffect, useState } from "react";
import { TbPencil, TbCamera } from "react-icons/tb";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";

interface UserBoardProps {
  className?: string;
}

const UserBoard: React.FC<UserBoardProps> = ({ className }) => {
  // 상태 관리
  const [isEditMode, setEditMode] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { user, setUser } = useAuthStore();

  const defaultAvatarPath = "/yunjili.png";

  // 사용자 정보 초기화
  useEffect(() => {
    if (user) {
      setNewNickname(user.nickname || "");
    }
  }, [user]);

  // 아바타 이미지 변경 핸들러
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // 편집 취소 핸들러
  const handleCancelEdit = () => {
    setEditMode(false);
    setNewAvatar(null);
    setAvatarPreview(null);
    setNewNickname(user?.nickname || "");
  };

  // 프로필 수정 함수
  const editProfile = async () => {
    if (!user) return;

    try {
      let avatarUrl = user.avatar;

      // 새 아바타 이미지가 있으면 업로드
      if (newAvatar) {
        const fileName = `avatar_${user.id}_${Date.now()}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, newAvatar);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = urlData.publicUrl;
      }

      // 사용자 정보 업데이트
      const { data, error: updateError } = await supabase
        .from("users")
        .update({ nickname: newNickname, avatar: avatarUrl })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      if (data) {
        setUser({ ...user, ...data } as AuthUser);
      }

      setEditMode(false);
    } catch (error) {
      console.error("프로필 업데이트 에러", error);
      alert("프로필 업데이트에 실패했습니다.");
    }
  };

  if (!user) return null;

  return (
    <div className={`w-[301px] h-[352px] perspective-1000 ${className}`}>
      <div
        className={`relative w-full h-full transition-transform duration-500 ${
          isEditMode ? "my-rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 프로필 카드 (앞면) */}
        <div className="absolute backface-hidden w-full h-full">
          <div className="bg-[#f0f8ff] rounded-lg p-6 shadow-md w-full h-full flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
              <Image
                src={user.avatar || defaultAvatarPath}
                alt="프로필 이미지"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-xl font-semibold mb-1">{user.nickname}</h2>
            <p className="text-sm text-gray-600 mb-4">{user.email}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
              onClick={() => setEditMode(true)}
            >
              <TbPencil className="mr-2" />
              프로필 수정
            </button>
          </div>
        </div>

        {/* 프로필 수정 카드 (뒷면) */}
        <div className="absolute top-0 left-0 w-full h-full my-rotate-y-180 backface-hidden">
          <div className="bg-white rounded-lg p-6 shadow-md w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-4">
              <div className="w-full h-full rounded-full overflow-hidden">
                <Image
                  src={avatarPreview || user.avatar || defaultAvatarPath}
                  alt="프로필 이미지"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* 카메라 아이콘 (이미지 변경 버튼) */}
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 cursor-pointer shadow-lg hover:bg-blue-600 transition-colors duration-300"
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
            {/* 닉네임 입력 필드 */}
            <input
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
              placeholder="새 닉네임"
            />
            {/* 취소 및 저장 버튼 */}
            <div className="flex space-x-2 w-full">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300 flex-1"
                onClick={handleCancelEdit}
              >
                취소
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex-1"
                onClick={editProfile}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBoard;
