"use client";

import { Tables } from "@/types/supabase";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Post = Tables<"posts">;

interface PostEditProps {
  id?: string;
}

const fetchDetailPost = async (id: string) => {
  const response = await fetch(`/api/community/${id}`);
  if (!response.ok) {
    throw new Error("게시글 불러오는데 실패했습니다.");
  }
  const data = response.json();
  return data;
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
  const [contents, setContents] = useState("");

  useEffect(() => {
    const getPost = async () => {
      try {
        if (!id) throw new Error("게시글 ID가 없습니다.");
        const data = await fetchDetailPost(id);
        setPost(data);
        setTitle(data.title);
        setContents(data.content);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getPost();
  }, [id]);

  console.log(post);

  const handleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!id) throw new Error("게시글 ID가 없습니다.");
      await editPost(title, contents);
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
      <div className="w-[700px] mx-auto p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">글 수정 하는데야!!!</h1>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="title"
          >
            제목
          </label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="contents"
          >
            내용
          </label>
          <textarea
            placeholder="내용을 입력하세요"
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            className="w-full h-[500px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {/* <h1 className="text-2xl font-bold mb-4 p-5">{post.title}</h1>
      <p className="text-sm text-gray-500 px-5">작성자: {post.nickname}</p>
      <p className="text-sm text-gray-500 px-5">
        작성일: {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="p-5">
        <div>{post.contents}</div>
      </div> */}
      <Link href={`/community/${id}`}>취소</Link>
      <button onClick={handleEdit}>완료</button>
    </>
  );
};

export default PostEditPage;
