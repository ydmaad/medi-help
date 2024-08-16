import React from "react";
import MediLists from "@/components/templates/mypage/MediLists";
import UserBoard from "@/components/templates/mypage/UserBoard";
import Posts from "@/components/templates/mypage/posts";

const MyPage = () => {
  return (
    <div className="max-w-[996px] mx-auto px-4 desktop:px-0 py-4 mt-20 desktop:mt-24">
      {/* 데스크탑 사이즈 레이아웃 */}
      <div className="hidden desktop:flex desktop:flex-row desktop:gap-[25px] mb-8">
        <div className="w-[301px]">
          <UserBoard className="h-full" />
        </div>
        <div className="w-[670px]">
          <MediLists className="h-full" />
        </div>
      </div>
      
      {/* 모바일 사이즈 레이아웃 */}
      <div className="flex flex-col gap-8 mb-8 desktop:hidden">
        <UserBoard className="w-full" />
        <MediLists className="w-full" />
      </div>
      
      {/* Posts는 항상 아래에 배치 */}
      <div className="mt-8">
        <Posts />
      </div>
    </div>
  );
};

export default MyPage;