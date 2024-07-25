"use client";

import { Tables } from "@/types/supabase";
import React from "react";

// 나중에 테이블 이름 바꿔 넣어야!!
type Post = Tables<"test_posts">;

interface PostDetailProps {
  id?: string;
}
const PostDetail: React.FC<PostDetailProps> = ({ id }) => {
  console.log(id);
  return <div>PostDetail</div>;
};

export default PostDetail;
