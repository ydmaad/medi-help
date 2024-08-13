// src/app/(root)/mypage/page.tsx
import React from "react";
import MediLists from "@/components/templates/mypage/MediLists";
import UserBoard from "@/components/templates/mypage/UserBoard";
import Posts from "@/components/templates/mypage/posts";

const MyPage: React.FC = () => {
  return (
    <div className="flex flex-col max-w-screen-xl mx-auto px-4 py-4 mt-20 gap-8">
      <div className="flex flex-row justify-between w-full max-w-6xl mx-auto">
        <div className="flex-1 max-w-sm mx-4">
          <UserBoard className="h-full" /> {/* Add full height */}
        </div>
        <div className="flex-1 mx-4">
          <MediLists className="h-full" /> {/* Add full height */}
        </div>
      </div>
      <div className="mt-8 max-w-6xl mx-auto px-4">
        <Posts />
      </div>
    </div>
  );
};

export default MyPage;
