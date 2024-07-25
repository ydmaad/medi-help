"use client";

import { Tables } from "@/types/supabase";
import React, { useEffect, useState } from "react";
import Comments from "./Comments";

// 나중에 테이블 이름 바꿔 넣어야!!
type Post = Tables<"test_posts">;

interface PostDetailProps {
  id?: string;
}

const deletePost = async () => {
  const response = await fetch("/api/community/${postId}", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("게시글 삭제에 실패했습니다.");
  }
};

const PostDetail: React.FC<PostDetailProps> = ({ id }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetailPost = async () => {
      try {
        const res = await fetch(`/api/community/${id}`);
        if (!res.ok) {
          throw new Error("게시글 불러오는데 실패했");
        }
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetailPost();
  }, [id]);

  const onhandleDelete = () => {
    deletePost();
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 p-5">{post.title}</h1>
      <p className="text-sm text-gray-500 px-5">작성자: {post.nickname}</p>
      <p className="text-sm text-gray-500 px-5">
        작성일: {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="p-5">
        <div>{post.contents}</div>
      </div>
      <button onClick={onhandleDelete}>삭제하기</button>
      <Comments />
    </>
  );
};

export default PostDetail;
