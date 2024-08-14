// src/components/templates/mypage/UserBoard.tsx
"use client";

import { AuthUser, useAuthStore } from "@/store/auth";
import React, { useEffect } from "react";
import { TbPencil } from "react-icons/tb";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";

interface UserBoardProps {
  className?: string;
}

const UserBoard: React.FC<UserBoardProps> = ({ className }) => {
  // 상태 관리
  const [isEditMode, setEditMode] = React.useState(false);
  const [newNickname, setNewNickname] = React.useState("");
  const [newAvatar, setNewAvatar] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const { user, setUser } = useAuthStore();

  // 컴포넌트 마운트 시 현재 닉네임 설정
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

  // 프로필 편집 함수
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

  // 사용자가 없으면 아무것도 렌더링하지 않음
  if (!user) return null;

  return (
    <div
      className={`flex flex-col items-center w-full p-6 rounded-xl text-primary-500 justify-center border-[2px] ${className} ${
        isEditMode ? "bg-[#ffffff] border-[#6EBEFB]" : "bg-[#e9f5fe]"
      }`}
      style={{ height: "100%" }}
    >
      {isEditMode ? (
        // 편집 모드 UI
        <>
          <div className="relative w-60 h-60 rounded-full mb-8">
            <Image
              src={avatarPreview || user.avatar || "/default-avatar.jpg"}
              alt="프로필 이미지"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute right-0 bottom-0 bg-[#40444C] rounded-full w-[80px] h-[80px] flex justify-center items-center">
              <label htmlFor="avatar-upload">
                <TbPencil className="text-[36px] text-[#ffffff] cursor-pointer" />
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
          <div className="flex flex-col items-center w-full">
            <input
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="border border-[#E0E2E4] px-5 py-3 rounded-[4px] mb-8 w-full"
              placeholder="새 닉네임 입력"
            />
            <div className="flex justify-between items-center gap-2 w-full">
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
        </>
      ) : (
        // 일반 모드 UI
        <>
          <div className="relative w-60 h-60 rounded-full overflow-hidden mb-8">
            <Image
              src={user.avatar || "/default-avatar.jpg"}
              alt="프로필 이미지"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col items-center max-w-full w-full">
            <div className="text-4xl font-bold text-primary-500 mb-2">
              {user.nickname}님
            </div>
            <div className="text-xl text-gray-800 mb-6">{user.email}</div>
            <button
              className="w-full py-3 flex items-center justify-center gap-2 bg-[#279ef9] text-[#f5f6f7] rounded-[4px] cursor-pointer hover:bg-[#1e7fe0] ease-in duration-300"
              onClick={() => setEditMode(true)}
            >
              <TbPencil className="text-2xl" />
              프로필 수정
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserBoard;
