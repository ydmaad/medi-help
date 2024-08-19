"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Comments from "./Comments";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { PostWithUser } from "@/types/communityTypes";
import {
  deletePost,
  fetchBookmark,
  fetchDetailPost,
  statusBookmark,
} from "@/lib/commentsAPI";
import { PostDetailSkeleton } from "@/components/molecules/CommunitySkeleton";

interface PostDetailProps {
  id: string;
}

// 게시글 아이디를 프롭스로 받음
const PostDetail = ({ id }: PostDetailProps) => {
  const [post, setPost] = useState<PostWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = useRouter();
  const { user } = useAuthStore();
  const [isBookmark, setIsBookmark] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
  }, [user, post, id]);

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

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  if (loading) return <PostDetailSkeleton />;
  if (error) return <div>에러: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="max-w-[996px] mx-auto overflow-hidden">
        <div className="flex flex-col">
          <div className="text-left py-2">
            <span className="text-lg desktop:text-xl text-brand-gray-400">
              {post.category}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <h1 className="text-xl font-bold desktop:text-[32px]">
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
              className="flex desktop:hidden items-center"
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

        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <p className="text-base font-extrabold text-brand-gray-800">
              {post.user?.nickname}
            </p>
            <div className="mx-2 h-4 w-px bg-gray-300"></div>
            <p className="hidden desktop:flex text-[16px] text-brand-gray-600 ml-0">
              {new Date(post.created_at).toLocaleString()}
            </p>
            <p className="flex desktop:hidden text-[16px] text-brand-gray-600 ml-0">
              {new Date(post.created_at).toLocaleDateString()}
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
          <div className="flex relative desktop:hidden mr-5">
            {user?.id === post.user.id && (
              <button onClick={handleOpen}>
                <Image
                  src="/3Dot.svg"
                  alt="점3개버튼"
                  width={24}
                  height={24}
                ></Image>
              </button>
            )}
            {isOpen && user?.id === post.user.id && (
              <div className="absolute -left-[27px] top-[15px]  flex h-[66px] w-[77px] flex-col items-center justify-center gap-[0.3rem] border shadow rounded-md bg-white z-10">
                <Link
                  href={`/community/${id}/edit`}
                  onClick={handleEditClick}
                  className="text-[12px] text-brand-gray-800"
                >
                  수정
                </Link>
                <div className="h-px w-[48px] bg-gray-300"></div>

                <button
                  onClick={handleDelete}
                  className="text-[12px] text-brand-gray-800"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
          <div className="hidden desktop:flex">
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
        </div>
        {/* 버튼 ===================== */}

        <div className="max-w-[996px] mt-[34px] desktop:mt-[44px]">
          {/* 여러 이미지 표시 */}
          <div
            className={`flex flex-wrap gap-4 ${post.img_url?.length === 0 ? "p-0" : "p-5"}`}
          >
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
          <div>{formatContent(post.contents)}</div>
        </div>
        <div className=" mb-[4px]">
          <p className="text-[14px] desktop:text-[16px] text-brand-gray-600">
            전체 댓글
            <span className="text-[14px] desktop:text-[16px] ml-[5px] font-black text-brand-primary-500">
              {post.comment_count}개
            </span>
          </p>
        </div>

        <Comments postId={id} />
      </div>
    </>
  );
};

export default PostDetail;
