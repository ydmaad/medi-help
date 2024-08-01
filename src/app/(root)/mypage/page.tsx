import React from "react";
import Details from "@/components/templates/mypage/Details";
import Comments from "@/components/templates/mypage/Commnets";
import UserBoard from "@/components/templates/mypage/UserBoard";

const MyPage: React.FC = () => {
  return (
    <div>
      <h1>My Page</h1>
      <UserBoard />
      <Details />
      <Comments />
    </div>
  );
};

export default MyPage;
