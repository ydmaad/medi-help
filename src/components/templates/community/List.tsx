"use client";

import Pagination from "@/components/molecules/Pagination";
import { Tables } from "@/types/supabase";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { IoIosArrowDown } from "react-icons/io";

type Post = Tables<"posts">;
type User = Tables<"users">;
type PostWithUser = Post & { user: Pick<User, "avatar" | "nickname"> } & {
  comment_count: number;
  bookmark_count: number;
};

interface ListProps {
  searchTerm: string;
  posts: PostWithUser[];
  setPosts: React.Dispatch<React.SetStateAction<PostWithUser[]>>;
}

const POST_PER_PAGE = 6;

// 게시글 불러오는 요청
const fetchPosts = async (page: number, sortOption: string) => {
  const res = await fetch(
    `/api/community?page=${page}&perPage=${POST_PER_PAGE}&sort=${sortOption}`
  );
  const result = await res.json();
  return { data: result.data, totalPosts: result.totalPosts };
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

const List = ({ searchTerm, posts, setPosts }: ListProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // 총 게시글 갯수
  const [totalPosts, setTotalPosts] = useState<number>(1);
  // 선택된 카테고리
  const [selectCategory, setSelectCategory] = useState<string>("전체");
  // 카테고리 별로 필터된 게시글
  const [categoryFilterPosts, setCategoryFilterPosts] = useState<
    PostWithUser[]
  >([]);
  const [sortOption, setSortOption] = useState<string>("최신순");
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const optionList = ["최신순", "오래된순", "인기순"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, totalPosts } = await fetchPosts(currentPage, sortOption);
        setPosts(data);
        setTotalPosts(totalPosts);
        if (selectCategory === "전체") {
          setCategoryFilterPosts(data);
        } else {
          const filtered = data.filter(
            (post: PostWithUser) => post.category === selectCategory
          );
          setCategoryFilterPosts(filtered);
        }
        const calculatedTotalPages = Math.ceil(totalPosts / POST_PER_PAGE);
        setTotalPages(calculatedTotalPages);
      } catch (error) {
        console.log("에러가 났네요 =>", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, currentPage, sortOption, selectCategory]);

  // console.log(posts);

  // 게시글 검색
  const filteredPosts = categoryFilterPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.contents.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // img_url을 배열로 만드는 함수
  const getImageUrls = (urlString: string | null): string[] => {
    return urlString ? urlString.split(",").map((url) => url.trim()) : [];
  };

  // 페이지 이동하는 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 게시글 작성 시간(**전)
  const formatTimeAgo = (date: Date | number | string): string => {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffDays = differenceInDays(now, d);
    // 7일이상 지난 게시글
    if (diffDays > 7) {
      return format(d, "yyyy년 MM월 dd일 HH:mm", { locale: ko });
    } else {
      return formatDistanceToNow(d, {
        addSuffix: true,
        locale: ko,
      }).replace(/약 /, "");
    }
  };

  // 카테고리 별 필터 핸들러
  const handleCategorySelect = async (category: string) => {
    setSelectCategory(category);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 돌아감
    try {
      const { data, totalPosts } = await fetchPosts(1, sortOption);
      setPosts(data);
      setTotalPosts(totalPosts);
      if (category === "전체") {
        setCategoryFilterPosts(data);
      } else {
        const filtered = data.filter(
          (post: PostWithUser) => post.category === category
        );
        setCategoryFilterPosts(filtered);
      }
      const calculatedTotalPages = Math.ceil(totalPosts / POST_PER_PAGE);
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      console.log("카테고리 변경 중 에러 발생:", error);
    }
  };
  // 정렬 리스트 펼기치 핸들러
  const handleOptionOpen = () => {
    setIsOptionOpen(!isOptionOpen);
  };

  // 정렬 리스트에서 옵션 선택 핸들러
  const handleOptionSelect = (option: string) => {
    setSortOption(option);
    setCurrentPage(1); // 정렬 옵션이 변경되면 첫 페이지로 도라감
  };

  // 게시글 로딩중 스켈레톤 적용
  if (isLoading) {
    return (
      <ul className="space-y-4">
        {[...Array(POST_PER_PAGE)].map((_, index) => (
          <ListSkeleton key={index} />
        ))}
      </ul>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="flex items-center">
            {["전체", "메디톡", "궁금해요", "건강 꿀팁"].map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 mr-2 rounded-full ${
                  selectCategory === category
                    ? "bg-brand-gray-600 text-white"
                    : "bg-brand-gray-50 text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative">
            <button
              onClick={handleOptionOpen}
              className="flex items-center justify-center text-brand-gray-600"
            >
              <span>{sortOption}</span>
              <IoIosArrowDown />
            </button>
            {isOptionOpen && (
              <div className="absolute -left-[28px] mt-2 flex h-[120px] w-[100px] flex-col items-center justify-center gap-[0.3rem] border shadow rounded-2xl bg-white z-10">
                {optionList.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => {
                      handleOptionSelect(option);
                      handleOptionOpen(); // 옵션 선택 후 리스트를 닫습니다.
                    }}
                    className="text-brand-gray-800 text-sm w-full hover:bg-gray-100"
                  >
                    {option}
                    {index !== optionList.length - 1 && (
                      <hr className="mt-[0.3rem] mx-auto w-[4.5rem] border-brand-gray-200" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {filteredPosts.map((item) => {
          const imageUrls = getImageUrls(item.img_url);
          const timeAgo = formatTimeAgo(item.created_at);
          return (
            <li key={item.id} className="block">
              <Link
                href={`/community/${item.id}`}
                className="block hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <div className="border rounded-2xl p-4 w-[1000px] h-[150px] my-5">
                  <div className="flex justify-between">
                    <div className="flex-grow pr-4">
                      <h2 className="text-xl font-semibold mb-2">
                        {item.title}
                        <span className="text-[#f66555] ml-1">
                          ({`${item.comment_count}`})
                        </span>
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-2 h-[48px]">
                        {item.contents}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <span>{item.user.nickname}</span>
                          <div className="mx-3 h-4 w-px bg-gray-300"></div>
                          <span>{timeAgo}</span>
                          <div className="mx-3 h-4 w-px bg-gray-300"></div>
                          <span>저장 {item.bookmark_count}</span>
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
                </div>
              </Link>
            </li>
          );
        })}
      </div>
      {totalPages > 1 && (
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
