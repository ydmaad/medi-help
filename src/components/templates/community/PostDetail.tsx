"use client";

import { Tables } from "@/types/supabase";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Comments from "./Comments";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";

type Post = Tables<"posts">;
type User = Tables<"users">;
type PostWithUser = Post & { user: Pick<User, "avatar" | "nickname" | "id"> };

interface PostDetailProps {
  id: string;
}

// 게시글 id를 받아 게시글 데이터 요청
// 따로 분리해서 재사용할 수 있는 부분(PostDetail, Edit)
const fetchDetailPost = async (id: string) => {
  try {
    const response = await fetch(`/api/community/${id}`);
    if (!response.ok) {
      throw new Error("게시글 불러오는데 실패했습니다");
    }
    const { data } = await response.json();
    return data[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 게시글 삭제 요청
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
  const { user } = useAuthStore();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchDetailPost(id);
        setPost(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  // useEffect(() => {
  //   console.log("현재 로그인 유저", user?.id);
  //   console.log("현재 게시글을 작성한 유저", post?.user.id);
  // }, [user, post]);

  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    if (!user || user.id !== post?.user.id) {
      alert("게시글을 삭제할 권한이 없습니다.");
      return;
    }
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

  // 사용자 권한 확인 함수
  const modifyUser = () => {
    return user && post && user.id === post.user.id;
  };

  // 수정 링크 클릭 핸들러
  const handleEditClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!modifyUser()) {
      e.preventDefault();
      alert("게시글을 수정할 권한이 없습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="max-w-3xl mx-auto overflow-hidden mt-20">
        <h1 className="text-2xl font-bold  px-4">{post.title}</h1>

        <div className="flex justify-between items-center px-2 py-3">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500 pl-2">{post.user?.nickname}</p>
            <div className="mx-2 h-4 w-px bg-gray-300"></div>
            <p className="text-sm text-gray-500 ml-0">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              className="text-sm text-gray-500 pr-2"
            >
              삭제
            </button>
            <div className="mx-4 h-4.5 w-px bg-gray-300"></div>
            <Link
              href={`/community/${id}/edit`}
              onClick={handleEditClick}
              className="text-sm text-gray-500 pl-2"
            >
              수정
            </Link>
          </div>
        </div>
        {/* 버튼 ===================== */}

        {/* 여러 이미지 표시 */}
        <div className="p-5 flex flex-wrap gap-4">
          {imageUrl.map((url, index) => (
            <div key={index}>
              <Image
                src={url.trim()}
                alt={`게시글 이미지 ${index + 1}`}
                width={300}
                height={200}
                priority
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          ))}
        </div>

        <div className="p-5 max-w-[1000px] ">
          <div>{formatContent(post.contents)}</div>
        </div>

        <Comments postId={id} />
      </div>
    </>
  );
};

export default PostDetail;
