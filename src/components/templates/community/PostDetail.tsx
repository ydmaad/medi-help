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
  console.log("이 게시글 북마크 한 데이터", result.data);
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

// 게시글 아이디를 프롭스로 받음
const PostDetail = ({ id }: PostDetailProps) => {
  const [post, setPost] = useState<PostWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = useRouter();
  const { user } = useAuthStore();
  const [isBookmark, setIsBookmark] = useState<boolean>(false);
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);

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

  // 북마크 토글 핸들러
  const handleBookmark = async () => {
    if (!user) {
      alert("북마크하려면 로그인이 필요합니다.");
      return;
    }

    try {
      await fetchBookmark(id, user.id);
      setIsBookmark((pre) => !pre);
      if (isBookmark) {
        console.log("북마크 제거");
      } else {
        console.log("북마크 추가");
      }
    } catch (error) {
      console.error("북마크 토글 중 오류:", error);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="max-w-3xl mx-auto overflow-hidden mt-20">
        <div className="flex items-center  ">
          <h1 className="text-2xl font-bold  px-4">{post.title}</h1>
          <button onClick={handleBookmark} className="flex itmes-center">
            <Image
              src={isBookmark ? "/bookmark.svg" : "/emptyBookmark.svg"}
              alt="북마크 아이콘"
              width={40}
              height={40}
            />
          </button>
        </div>

        <div className="flex justify-between items-center px-2 py-3">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500 pl-2">{post.user?.nickname}</p>
            <div className="mx-2 h-4 w-px bg-gray-300"></div>
            <p className="text-sm text-gray-500 ml-0">
              {new Date(post.created_at).toLocaleString()}
            </p>
            <div className="mx-2 h-4 w-px bg-gray-300"></div>
            <p className="text-sm text-gray-500 ml-0">
              저장
              <span className="text-sm text-brand-primary-400 ml-1">
                {post.bookmark_count}
              </span>
            </p>
          </div>

          {/* 버튼 */}
          {user?.id === post.user.id && (
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
          )}
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
