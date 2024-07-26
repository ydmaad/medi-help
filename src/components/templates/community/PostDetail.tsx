"use client";

import { Tables } from "@/types/supabase";
import React, { useEffect, useState } from "react";
import Comments from "./Comments";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 나중에 테이블 이름 바꿔 넣어야!!
type Post = Tables<"posts">;

interface PostDetailProps {
  id?: string;
}

const deletePost = async () => {
  const response = await fetch("/api/community/${postId}", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw Error("게시글 삭제에 실패했습니다.");
  }
};

const PostDetail: React.FC<PostDetailProps> = ({ id }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = useRouter();

  useEffect(() => {
    const fetchDetailPost = async () => {
      try {
        const response = await fetch(`/api/community/${id}`);
        if (!response.ok) {
          throw new Error("게시글 불러오는데 실패했");
        }
        const { data } = await response.json();
        console.log(1, data);
        setPost(data[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailPost();
  }, [id]);
  console.log(post);

  const onhandleDelete = async () => {
    await deletePost();
    route.push(`/community/`);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  // console.log(new Date(post.data[0].created_at));
  return (
    <>
      <h1 className="text-2xl font-bold mb-4 p-5">{post.title}</h1>
      <p className="text-sm text-gray-500 px-5">작성자: {post.nickname}</p>
      <p className="text-sm text-gray-500 px-5">
        작성일: {new Date(post.created_at).toLocaleString()}
      </p>
      <div className="p-5">
        <div>{post.contents}</div>
      </div>
      <button onClick={onhandleDelete}>삭제하기</button>
      {/* // 폴더구조 확인하고 수정하기 */}
      <Link href={`/community/${id}/edit`}>수정하기</Link>

      <Comments />
    </>
  );
};

export default PostDetail;
