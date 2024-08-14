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
type PostWithUser = Post & {
  user: Pick<User, "avatar" | "nickname" | "id">;
} & {
  bookmark_count: number;
};

interface PostDetailProps {
  id: string;
}

type BookmarkData = Tables<"bookmark">;

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

// 북마크 상태 확인 요청
const statusBookmark = async (postId: string): Promise<BookmarkData[]> => {
  const response = await fetch(`/api/community/${postId}/bookmark`);
  if (!response.ok) {
    throw new Error("북마크 상태 확인 실패");
  }
  const result = await response.json();
  return result.data;
};

// 북마크 토글 요청
const fetchBookmark = async (postId: string, userId: string) => {
  try {
    const response = await fetch(`/api/community/${postId}/bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Id": userId,
      },
    });
    if (!response.ok) {
      throw new Error("북마크 토글 실패");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log("북마크 토글 중 오류 : ", error);
    throw error;
  }
};

// 게시글 상세페이지 스켈레톤
const PostDetailSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto mt-20 animate-pulse">
      {/* 카테고리 */}
      <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
      {/* 제목 */}
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      {/* 작성자 정보 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="h-5 bg-gray-200 rounded w-40"></div>
          <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      {/* 이미지 */}
      <div className="h-64 bg-gray-200 rounded w-1/2 mb-6"></div>
      {/* 게시글 내용 */}
      <div className="space-y-2 mb-8">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      {/* 댓글 */}
      <div className="h-40 bg-gray-200 rounded w-full"></div>
    </div>
  );
};

// 게시글 아이디를 프롭스로 받음
const PostDetail = ({ id }: PostDetailProps) => {
  const [post, setPost] = useState<PostWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = useRouter();
  const { user } = useAuthStore();
  const [isBookmark, setIsBookmark] = useState<boolean>(false);

  // 게시글 불러오기
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

  console.log(post);

  // 북마크한 게시글과 유저가 일치하는지 확인
  useEffect(() => {
    const checkBookmarkUser = async () => {
      if (user) {
        try {
          const bookmarkData = await statusBookmark(id);
          const userBookmark = bookmarkData.find(
            (mark) => mark.user_id === user.id
          );
          setIsBookmark(!!userBookmark);
          // console.log("이거는 북마크데이터!!:", bookmarkData);
        } catch (error) {
          console.error("북마크 확인 오류:", error);
        }
      }
    };
    checkBookmarkUser();
  }, [user, post]);

  // useEffect(() => {
  //   console.log("현재 로그인 유저", user?.id);
  //   console.log("현재 게시글을 작성한 유저", post?.user.id);
  //   console.log("현재 북마크 상태:", isBookmark);
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

  // 북마크 토글 핸들러
  const handleBookmark = async () => {
    if (!user) {
      alert("북마크하려면 로그인이 필요합니다.");
      return;
    }
    try {
      await fetchBookmark(id, user.id);
      setIsBookmark((pre) => !pre);
      // if (isBookmark) {
      //   console.log("북마크 제거");
      // } else {
      //   console.log("북마크 추가");
      // }
    } catch (error) {
      console.error("북마크 토글 중 오류:", error);
    }
  };

  if (loading) return <PostDetailSkeleton />;
  if (error) return <div>에러: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="max-w-3xl mx-auto overflow-hidden mt-20">
        <div className="flex flex-col">
          <div className="text-left px-4 py-2">
            <span className="text-lg desktop:text-xl text-brand-gray-400">
              {post.category}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <h1 className="text-xl font-bold px-3 desktop:text-[32px]">
                {post.title}
              </h1>
              <button
                onClick={handleBookmark}
                className="hidden desktop:flex items-center ml-2"
              >
                <Image
                  src={isBookmark ? "/bookmark.svg" : "/emptyBookmark.svg"}
                  alt="북마크 아이콘"
                  width={40}
                  height={40}
                />
              </button>
            </div>
            <button
              onClick={handleBookmark}
              className="flex desktop:hidden mr-4 items-center"
            >
              <Image
                src={isBookmark ? "/bookmark.svg" : "/emptyBookmark.svg"}
                alt="북마크 아이콘"
                width={40}
                height={40}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center px-2 py-3">
          <div className="flex items-center space-x-2">
            <p className="text-base  font-extrabold text-brand-gray-800 pl-2">
              {post.user?.nickname}
            </p>
            <div className="mx-2 h-4 w-px bg-gray-300"></div>
            <p className="text-base text-brand-gray-600 ml-0">
              {new Date(post.created_at).toLocaleString()}
            </p>
            <div className="mx-2 h-4 w-px bg-gray-300"></div>
            <p className="text-base text-brand-gray-600 ml-0">
              저장
              <span className="text-base text-brand-primary-400 ml-1">
                {post.bookmark_count}
              </span>
            </p>
          </div>

          {/* 버튼 */}
          {user?.id === post.user.id && (
            <div className="flex space-x-2">
              <button
                onClick={handleDelete}
                className="text-base text-gray-500 pr-2"
              >
                삭제
              </button>
              <div className="mx-4 h-4.5 w-px bg-gray-300"></div>
              <Link
                href={`/community/${id}/edit`}
                onClick={handleEditClick}
                className="text-base text-gray-500 pl-2"
              >
                수정
              </Link>
            </div>
          )}
        </div>
        {/* 버튼 ===================== */}

        {/* 여러 이미지 표시 */}
        <div className="p-5 flex flex-wrap gap-4">
          {post.img_url?.map((url, index) => (
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
