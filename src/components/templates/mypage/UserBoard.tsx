// src/components/templates/mypage/UserBoard.tsx
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
  // 상태 관리
  const [isEditMode, setEditMode] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { user, setUser } = useAuthStore();
  const [nicknameValidation, setNicknameValidation] = useState<string | null>(
    null
  );

  const defaultAvatarPath = "/default-avatar.jpg";

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
    setNicknameValidation(null);
  };

  // 닉네임 중복 확인 함수
  const checkNicknameAvailability = async (nickname: string) => {
    if (nickname === user?.nickname) {
      setNicknameValidation(null);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("nickname")
      .eq("nickname", nickname)
      .maybeSingle();

    if (error) {
      console.error("Error checking nickname:", error);
      setNicknameValidation("닉네임 확인 중 오류가 발생했습니다.");
    } else if (data) {
      setNicknameValidation("사용 불가한 닉네임입니다.");
    } else {
      setNicknameValidation("사용 가능한 닉네임입니다.");
    }
  };

  // 닉네임 변경 핸들러
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nickname = e.target.value;
    setNewNickname(nickname);
    if (nickname !== user?.nickname) {
      checkNicknameAvailability(nickname);
    } else {
      setNicknameValidation(null);
    }
  };

  // 프로필 수정 함수
  const editProfile = async () => {
    if (!user) return;
    if (nicknameValidation !== "사용 가능한 닉네임입니다.") {
      alert("유효한 닉네임을 입력해주세요.");
      return;
    }

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
      setNicknameValidation(null);
    } catch (error) {
      console.error("프로필 업데이트 에러", error);
      alert("프로필 업데이트에 실패했습니다.");
    }
  };

  if (!user) return null;

  return (
    <div className={`${className} w-[301px] h-auto desktop:h-[352px]`}>
      {/* 데스크탑 버전 */}
      <div className="hidden desktop:block h-[352px]">
        <div className="w-full h-full perspective-1000">
          <div
            className={`relative w-full h-full transition-transform duration-500 ${
              isEditMode ? "my-rotate-y-180" : ""
            } preserve-3d`}
          >
            {/* 프로필 카드 (앞면) */}
            <div className="absolute backface-hidden w-full h-full">
              <div className="bg-brand-primary-50 rounded-[20px] border-[1px] border-transparent w-full h-full flex flex-col items-center justify-center p-6">
                <div className="relative w-[120px] h-[120px] rounded-full shadow-md mb-1">
                  <Image
                    src={user.avatar || defaultAvatarPath}
                    alt="프로필 이미지"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div className="text-[24px] text-center w-full font-bold text-brand-gray-1000 mt-4 mb-1">
                  {user.nickname}
                </div>
                <div className="text-[14px] text-brand-gray-1000">
                  {user.email}
                </div>
                <button
                  className="mt-[30px] mb-[1px] w-[253px] h-[40px] py-2.5 px-3 bg-brand-primary-500 text-white rounded cursor-pointer text-[16px] flex items-center justify-center"
                  onClick={() => setEditMode(true)}
                >
                  프로필 수정
                </button>
              </div>
            </div>

            {/* 프로필 수정 카드 (뒷면) */}
            <div className="absolute top-0 left-0 w-full h-full my-rotate-y-180 backface-hidden">
              <div className="bg-white rounded-xl border-[2px] border-brand-primary-300 w-full h-full flex flex-col items-center justify-center p-6">
                <div className="relative w-[120px] h-[120px] rounded-full shadow-md mb-4">
                  <Image
                    src={avatarPreview || user.avatar || defaultAvatarPath}
                    alt="프로필 이미지"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-brand-gray-800 rounded-full p-2 cursor-pointer"
                  >
                    <TbCamera className="text-white text-[24px]" />
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
                  onChange={handleNicknameChange}
                  className="text-[18px] border border-brand-gray-200 px-3 py-2 rounded mt-4 mb-1 w-full text-center"
                  placeholder="새 닉네임 입력"
                />
                {nicknameValidation && (
                  <div
                    className={`text-[14px] ${
                      nicknameValidation === "사용 가능한 닉네임입니다."
                        ? "text-[#3FDE9C]"
                        : "text-[#F66555]"
                    } mb-4`}
                  >
                    {nicknameValidation}
                  </div>
                )}
                {/* 버튼 컨테이너에 상단 마진 추가 */}
                <div className="flex justify-between items-center gap-2 w-full mt-6">
                  <button
                    className="w-full py-2 bg-brand-primary-50 text-brand-primary-500 rounded-md cursor-pointer text-[16px]"
                    onClick={handleCancelEdit}
                  >
                    취소
                  </button>
                  <button
                    className="w-full py-2 bg-brand-primary-500 text-white rounded-md cursor-pointer text-[16px]"
                    onClick={editProfile}
                    disabled={
                      nicknameValidation !== "사용 가능한 닉네임입니다."
                    }
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
        {!isEditMode ? (
          <div className="flex items-center bg-[#e9f5fe] rounded-xl border border-brand-primary-100 w-[335px] h-[128px] px-[42px] py-[24px]">
            <div className="flex items-center gap-[12px]">
              <div className="relative w-[80px] h-[80px] shadow-md rounded-full">
                <Image
                  src={user.avatar || defaultAvatarPath}
                  alt="프로필 이미지"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
                <button
                  className="absolute right-0 bottom-0 w-[28px] h-[28px] bg-[#279ef9] rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => setEditMode(true)}
                >
                  <TbPencil className="text-white w-4 h-4" />
                </button>
              </div>
              <div className="ml-4">
                <div className="text-[20px] font-black text-brand-gray-1000">
                  {user.nickname}님
                </div>
                <div className="text-[14px] text-brand-gray-600 mt-1">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative bg-white rounded-xl border border-brand-primary-500 w-[335px] h-[327px] p-[24px]">
            <div className="flex flex-col items-center gap-[16px]">
              <div className="relative w-[120px] h-[120px] shadow-md rounded-full mb-4">
                <Image
                  src={avatarPreview || user.avatar || defaultAvatarPath}
                  alt="프로필 이미지"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
                <label
                  htmlFor="mobile-avatar-upload"
                  className="absolute inset-0 w-full flex justify-center items-center bg-black opacity-60 rounded-full p-2 cursor-pointer"
                >
                  <TbCamera className="text-white text-4xl text-brand-gray-200" />
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
                onChange={handleNicknameChange}
                className="border border-[#e0e2e4] px-3 py-2 rounded-md mb-4 w-full h-[48px]"
                placeholder="새 닉네임 입력"
              />
              {nicknameValidation && (
                <div
                  className={`absolute bottom-[79px] left-[30px] text-[14px] ${
                    nicknameValidation === "사용 가능한 닉네임입니다."
                      ? "text-[#3FDE9C]"
                      : "text-[#F66555]"
                  }`}
                >
                  {nicknameValidation}
                </div>
              )}
              <div className="flex justify-between items-center gap-2 w-full h-[40px]">
                <button
                  className="w-full h-full py-2 bg-[#e9f5fe] text-[#279ef9] rounded-md cursor-pointer text-sm"
                  onClick={handleCancelEdit}
                >
                  취소
                </button>
                <button
                  className="w-full h-full py-2 bg-[#279ef9] text-white rounded-md cursor-pointer text-sm"
                  onClick={editProfile}
                  disabled={nicknameValidation !== "사용 가능한 닉네임입니다."}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBoard;
