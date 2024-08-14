// src/app/(root)/mypage/page.tsx

import React from "react";
import MediLists from "@/components/templates/mypage/MediLists";
import UserBoard from "@/components/templates/mypage/UserBoard";
import Posts from "@/components/templates/mypage/posts";

const MyPage: React.FC = () => {
  return (
    <div className="max-w-[1000px] mx-auto px-4 desktop:px-4 py-4 mt-20 desktop:mt-24">
      {/* 데스크탑 사이즈 레이아웃 */}
      <div className="hidden desktop:flex desktop:flex-row desktop:gap-6 mb-8">
        <div className="flex-1 max-w-[35%]">
          <UserBoard className="h-full" />
        </div>
        <div className="flex-1 max-w-[65%]">
          <MediLists className="h-full" />
        </div>
      </div>
      
      {/* 모바일 사이즈 레이아웃 */}
      <div className="flex flex-col gap-8 mb-8 desktop:hidden">
        <UserBoard className="h-full" />
        <div className="w-full">
          <MediLists className="h-full" />
        </div>
      </div>
      
      {/* Posts는 항상 아래에 배치 */}
      <div className="mt-8">
        <Posts />
      </div>
    </div>
  );
};
export default MyPage;
