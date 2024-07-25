"use client";

import { Tables } from "@/types/supabase";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// 나중에 테이블 이름 바꿔 넣어야!!
type Post = Tables<"posts">;

interface PostEditProps {
  id?: string;
}

const fetchDetailPost = async (id: string) => {
  const response = await fetch(`/api/community/${id}`);
  if (!response.ok) {
    throw new Error("게시글 불러오는데 실패했습니다.");
  }
  return await response.json();
};

const editPost = async (title: string, content: string) => {
  const response = await fetch("/api/community/${postId}", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    throw Error("게시글 수정에 실패했습니다.");
  }

  return await response.json();
};

const PostEditPage: React.FC<PostEditProps> = ({ id }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const getPost = async () => {
      try {
        if (!id) throw new Error("게시글 ID가 없습니다.");
        const data = await fetchDetailPost(id);
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getPost();
  }, [id]);

  console.log(post);

  const onhandleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!id) throw new Error("게시글 ID가 없습니다.");
      await editPost(title, content);
      // 수정 성공 처리 (예: 알림 표시, 페이지 이동 등)
    } catch (error) {
      setError((error as Error).message);
    }
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
      <Link href={`/community/${id}`}>취소</Link>
      <button onClick={onhandleEdit}>완료</button>
    </>
  );
};

export default PostEditPage;
