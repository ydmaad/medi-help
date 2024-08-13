// src/app/(root)/mypage/page.tsx

import React from "react";
import MediLists from "@/components/templates/mypage/MediLists";
import UserBoard from "@/components/templates/mypage/UserBoard";
import Posts from "@/components/templates/mypage/posts";

const MyPage: React.FC = () => {
  return (
    <div className="flex flex-col max-w-screen-xl mx-auto px-60 py-4 mt-20 gap-8">
      {/* 좌우 패딩을 px-8로 늘렸습니다 */}
      <div className="flex flex-row justify-start w-full gap-6">
        {/* 간격을 약간 줄이고 px-2로 조정 */}
        <div className="flex-1 max-w-[35%]">
          {/* 최대 너비를 35%로 설정 */}
          <UserBoard className="h-full" />
        </div>
        <div className="flex-1 max-w-[65%]">
          {/* 최대 너비를 65%로 설정 */}
          <MediLists className="h-full" />
        </div>
      </div>
      <div className="mt-8">
        <Posts />
      </div>
    </div>
  );
};

export default MyPage;
