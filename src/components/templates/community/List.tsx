"use client";

import Pagination from "@/components/molecules/Pagination";
import { Tables } from "@/types/supabase";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

type Post = Tables<"posts">;
type User = Tables<"users">;
type PostWithUser = Post & { user: Pick<User, "avatar" | "nickname"> };

interface ListProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  posts: PostWithUser[];
  setPosts: React.Dispatch<React.SetStateAction<PostWithUser[]>>;
}

const POST_PER_PAGE = 6;

// 게시글 불러오는 요청
const fetchPosts = async (page: number, limit: number) => {
  const res = await fetch(
    `/api/community?page=${page}&numOfRows=${POST_PER_PAGE}&limit=${limit}`
  );
  const data = await res.json();
  console.log("API response:", data);
  return data;
};

// 게시글 리스트 스켈레톤
const ListSkeleton = () => {
  return (
    <li className="border p-4 w-[1000px] h-[150px] my-5 animate-pulse">
      <div className="flex justify-between">
        <div className="flex-grow pr-4">
          <div className="h-7 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/5 mt-2"></div>
        </div>
        <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0"></div>
      </div>
    </li>
  );
};

const List: React.FC<ListProps> = ({
  searchTerm,
  setSearchTerm,
  posts,
  setPosts,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      // console.log("검색어가 업데이트 돼는 부분!?!?", searchTerm);
      try {
        const response = await fetchPosts(currentPage, POST_PER_PAGE);
        setPosts(response.data);
        setTotalPosts(response.total);
        console.log("Total posts:", response.total);
      } catch (error) {
        console.log("에러가 났네요 =>", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, setPosts, currentPage]);
  // console.log(posts);

  // 게시글 검색
  const filteredPosts = posts
    ? posts
        .filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.contents.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    : [];

  // img_url을 배열로 만드는 함수
  const getImageUrls = (urlString: string | null): string[] => {
    return urlString ? urlString.split(",").map((url) => url.trim()) : [];
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalPosts / POST_PER_PAGE);

  // 현재 페이지에 해당하는 게시글 선택
  // const pageStartIndex = (currentPage - 1) * POST_PER_PAGE;
  // const pageEndIndex = pageStartIndex + POST_PER_PAGE;
  // const currentPagePosts = filteredPosts.slice(pageStartIndex, pageEndIndex);

  const formatTimeAgo = (date: Date | number | string): string => {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffDays = differenceInDays(now, d);
    if (diffDays > 7) {
      return format(d, "yyyy년 MM월 dd일 HH:mm", { locale: ko });
    } else {
      return formatDistanceToNow(d, {
        addSuffix: true,
        locale: ko,
      }).replace(/약 /, "");
    }
  };

  // 게시글 로딩중 스켈레톤 적용
  if (isLoading) {
    return (
      <ul className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <ListSkeleton key={index} />
        ))}
      </ul>
    );
  }

  return (
    <>
      <ul className="space-y-4">
        {filteredPosts.map((item) => {
          const imageUrls = getImageUrls(item.img_url);
          const timeAgo = formatTimeAgo(item.created_at);
          return (
            <>
              {/* 상세페이지로 이동 */}
              <Link
                key={item.id}
                href={`/community/${item.id}`}
                className="block hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <li className="border p-4 w-[1000px] h-[150px] my-5">
                  <div className="flex justify-between">
                    <div className="flex-grow pr-4">
                      <h2 className="text-xl font-semibold mb-2">
                        {item.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-2 h-[48px]">
                        {item.contents}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          {/* 유저 아바타 이미지 - 최종으로 안쓸 거면 아예 삭제하기 */}
                          {/* <Image
                          src={
                            (item.user.avatar as string) ||
                            "/default-avatar.jpg"
                          }
                          alt="user_img"
                          width={20}
                          height={20}
                          className="rounded-full object-cover w-10 h-10 mr-2"
                        /> */}
                          <span>{item.user.nickname}</span>
                          <span className="ml-3">{timeAgo}</span>
                          {/* 북마크 기능 완료 후 수정 */}
                          <span className="ml-3">저장{}</span>
                        </div>
                      </div>
                    </div>
                    {imageUrls.length > 0 && (
                      <div className="w-24 h-24 flex-shrink-0">
                        <Image
                          src={imageUrls[0]}
                          alt="Post image"
                          width={96}
                          height={96}
                          className="object-cover w-full h-full rounded"
                        />
                      </div>
                    )}
                  </div>
                </li>
              </Link>
            </>
          );
        })}
      </ul>
      {1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default List;
