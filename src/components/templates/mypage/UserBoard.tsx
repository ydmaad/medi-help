// src/components/templates/mypage/UserBoard.tsx

"use client";

import { AuthUser, useAuthStore } from "@/store/auth";
import React from "react";
import { TbPencil } from "react-icons/tb";
import { supabase } from "@/utils/supabase/client";

interface UserBoardProps {
  className?: string;
}

const UserBoard: React.FC<UserBoardProps> = ({ className }) => {
  const [isEditMode, setEditMode] = React.useState(false);
  const [newNickname, setNewNickname] = React.useState("");
  const [newAvatar, setNewAvatar] = React.useState<File | null>(null); // 새로운 아바타 파일을 위한 상태
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null); // 아바타 미리보기 상태
  const { user, setUser } = useAuthStore();

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
  };

  const editProfile = async () => {
    try {
      let avatarUrl = user?.avatar;

      if (newAvatar) {
        const fileName = `${Date.now()}_${newAvatar.name}`;
        const { data: imgUploadData, error: imgUploadError } =
          await supabase.storage
            .from("posts_image_url")
            .upload(fileName, newAvatar);

        console.log(imgUploadData);

        if (imgUploadError) {
          console.error(
            `이미지 업로드 실패 : ${newAvatar.name}`,
            imgUploadError,
          );
          return;
        }

        const { data: urlData } = supabase.storage
          .from("posts_image_url")
          .getPublicUrl(fileName);

        avatarUrl = urlData?.publicUrl || avatarUrl;
      }

      const { error: updateError } = await supabase
        .from("user")
        .update({ nickname: newNickname, avatar: avatarUrl })
        .eq("id", user?.id);

      if (updateError) {
        console.error("프로필 업데이트 실패", updateError);
        return;
      }

      const newUser = {
        ...user,
        nickname: newNickname,
        avatar: avatarUrl,
      };
      setUser(newUser as unknown as AuthUser);

      setEditMode(false);
    } catch (error) {
      console.error("프로필 업데이트 에러", error);
    }
  };

  return (
    <div
      className={`flex flex-col items-center w-full p-6 rounded-xl text-primary-500 justify-center border-[2px] ${className} ${isEditMode ? "bg-[#ffffff] border-[#6EBEFB]" : "bg-[#e9f5fe]"}`}
      style={{ height: "100%" }}
    >
      {isEditMode ? (
        <>
          <div className="relative w-60 h-60 rounded-full mb-8">
            <img
              src={
                avatarPreview ||
                (user?.avatar ? user.avatar : "/default-avatar.jpg")
              }
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
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <input
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="border border-[#E0E2E4] px-5 py-3 rounded-[4px] mb-8 w-full"
              placeholder="새 닉네임 입력"
            />
            <div className="flex justify-between items-center gap-2">
              <button
                className="w-full min-w-40 py-3 flex items-center justify-center gap-2 bg-[#E9F5FE] text-[#279ef9] rounded-[4px] cursor-pointer"
                onClick={handleCancelEdit}
              >
                취소
              </button>
              <button
                className="w-full min-w-40 py-3 flex items-center justify-center gap-2 bg-[#279ef9] text-[#f5f6f7] rounded-[4px] cursor-pointer"
                onClick={editProfile}
              >
                저장
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative w-60 h-60 rounded-full overflow-hidden mb-8">
            <img
              src={user?.avatar ? user.avatar : "/default-avatar.jpg"}
              alt="프로필 이미지"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col items-center max-w-full w-full">
            <div className="text-4xl font-bold text-primary-500 mb-2">
              {user?.nickname}님
            </div>
            <div className="text-xl text-gray-800 mb-6">{user?.email}</div>
            <button
              className="w-full min-w-40 py-3 flex items-center justify-center gap-2 bg-[#279ef9] text-[#f5f6f7] rounded-[4px] cursor-pointer hover:bg-[#1e7fe0] ease-in duration-300"
              onClick={() => {
                setEditMode(true);
              }}
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
