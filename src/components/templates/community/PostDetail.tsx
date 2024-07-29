"use client";

import { Tables } from "@/types/supabase";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Comments from "./Comments";
import Image from "next/image";

type Post = Tables<"posts">;
type User = Tables<"users">;
type PostWithUser = Post & { user: Pick<User, "avatar" | "nickname"> };

interface PostDetailProps {
  id: string;
}

const deletePost = async (id: string) => {
  const response = await fetch(`/api/community/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw Error("게시글 삭제에 실패했습니다.");
  }
};

// 게시글 아이디를 프롭스로 받음
const PostDetail: React.FC<PostDetailProps> = ({ id }) => {
  const [post, setPost] = useState<PostWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = useRouter();

  useEffect(() => {
    // 따로 분리해서 재사용할 수 있는 부분
    const fetchDetailPost = async () => {
      try {
        const response = await fetch(`/api/community/${id}`);
        if (!response.ok) {
          throw new Error("게시글 불러오는데 실패했");
        }
        const { data } = await response.json();
        // console.log(1, data);
        setPost(data[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailPost();
  }, [id]);

  // TODO : 콘솔 확인하면서 진행!! - post에 user 정보(avatar, nickname 안 담김)
  // console.log(post);

  // 게시글 삭제
  const handleDelete = async () => {
    if (id) {
      try {
        await deletePost(id);
        alert("게시글을 삭제하였습니다.");
        route.push(`/community/`);
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
        setError("게시글 삭제에 실패했습니다.");
      }
    } else {
      setError("게시글 ID가 없습니다.");
    }
  };

  // img_url을 배열로 만듦
  const imageUrl = post?.img_url ? post.img_url.split(",") : [];

  // 내용 표시 - 단락 구분
  const formatContent = (content: string) => {
    return content.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph}
      </p>
    ));
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  // TODO : 닉네임 확인!!
  // console.log(post.user?.nickname); // undefined 나옴
  // console.log(new Date(post.data[0].created_at));
  return (
    <>
      <h1 className="text-2xl font-bold mb-4 p-5">{post.title}</h1>
      <p className="text-sm text-gray-500 px-5">
        작성자: {post.user?.nickname}
      </p>
      <p className="text-sm text-gray-500 px-5">
        작성일: {new Date(post.created_at).toLocaleString()}
      </p>

      {/* 여러 이미지 표시 */}
      <div className="p-5 flex flex-wrap gap-4">
        {imageUrl.map((url, index) => (
          <div key={index}>
            <Image
              src={url.trim()}
              alt={`게시글 이미지 ${index + 1}`}
              width={300}
              height={200}
            />
          </div>
        ))}
      </div>

      <div className="p-5 w-[500px] ">
        <div>{formatContent(post.contents)}</div>
      </div>
      <button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out"
      >
        삭제하기
      </button>

      {/* // 폴더구조 확인하고 수정하기 */}
      <Link
        href={`/community/${id}/edit`}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded inline-flex items-center transition duration-300 ease-in-out"
      >
        수정하기
      </Link>
      <Comments postId={id} />
    </>
  );
};

export default PostDetail;
