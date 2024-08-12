// src/app/(root)/mypage/page.tsx
import React from "react";
import MediLists from "@/components/templates/mypage/MediLists";
import UserBoard from "@/components/templates/mypage/UserBoard";
import Posts from "@/components/templates/mypage/posts";

const MyPage: React.FC = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-8 py-4 mt-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <UserBoard className="flex-1" />
        <MediLists className="flex-1" />
      </div>
      <div className="mt-8">
        <Posts />
      </div>
    </div>
  );
};

export default MyPage;
