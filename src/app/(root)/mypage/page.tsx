import React from "react";
import Details from "@/components/templates/mypage/Details";
import MediLists from "@/components/templates/mypage/MediLists";
import Posts from "@/components/templates/mypage/posts";
import UserBoard from "@/components/templates/mypage/UserBoard";

const MyPage: React.FC = () => {
  return (
    <div>
      <h1>My Page</h1>
      <UserBoard />
      <Details />
      <MediLists />
      <Posts />
    </div>
  );
};

export default MyPage;
