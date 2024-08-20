"use client";

import Pagination from "@/components/molecules/Pagination";
import React, { useEffect, useState } from "react";
import { fetchPosts } from "@/lib/commentsAPI";
import { POST_PER_PAGE } from "@/constants/constant";
import { PostWithUser } from "@/types/communityTypes";
import SortOption from "@/components/molecules/SortOption";
import PostItem from "@/components/molecules/PostItem";
import PostSearchFail from "@/components/molecules/PostSearchFail";
import CategorySelect from "@/components/molecules/CategorySelect";
import { PostListSkeleton } from "@/components/molecules/CommunitySkeleton";
import { useCommunitySearchFlagStore } from "@/store/communitySearchFlag";

interface ListProps {
  searchTerm: string;
  posts: PostWithUser[];
  setPosts: React.Dispatch<React.SetStateAction<PostWithUser[]>>;
}

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
  const category = ["전체", "메디톡", "궁금해요", "건강 꿀팁"];
  const { isSearchOpen, setIsSearchOpen } = useCommunitySearchFlagStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, totalPosts } = await fetchPosts(
          currentPage,
          sortOption,
          searchTerm
        );
        // console.log("현재페이지", currentPage);
        // console.log(data);
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
  }, [searchTerm, currentPage, sortOption, selectCategory, setPosts]);

  // console.log(posts);

  // 게시글 검색
  // const filteredPosts = categoryFilterPosts.filter(
  //   (post) =>
  //     post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     post.contents.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     post.user.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // console.log(searchTerm);

  // 페이지 이동하는 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 카테고리 별 필터 핸들러
  const handleCategorySelect = async (category: string) => {
    setSelectCategory(category);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 돌아감
    try {
      const { data, totalPosts } = await fetchPosts(1, sortOption, searchTerm);
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

  // console.log(categoryFilterPosts);

  // 게시글 로딩중 스켈레톤 적용
  if (isLoading) {
    return (
      <ul className="space-y-4">
        {[...Array(POST_PER_PAGE)].map((_, index) => (
          <PostListSkeleton key={index} />
        ))}
      </ul>
    );
  }

  return (
    <>
      <div className="mt-[16px]">
        {/* 카테고리 선택 */}
        {isSearchOpen ? null : (
          <div className="flex justify-between">
            <div className="flex items-center overflow-x-auto scrollbar-hide desktop:overflow-x-visible whitespace-nowrap  pb-2 desktop:pb-0">
              <CategorySelect
                categories={category}
                selectCategory={selectCategory}
                onSelectCategory={handleCategorySelect}
              ></CategorySelect>
            </div>
            <SortOption
              sortOption={sortOption}
              setSortOption={setSortOption}
              setCurrentPage={setCurrentPage}
            ></SortOption>
          </div>
        )}

        <div className="hidden desktop:flex mb-[8px]">
          {searchTerm.length === 0 ? (
            <p className="text-[16px] ml-[8px] text-left">
              전체
              <span className="text-brand-gray-600 ml-[8px]">
                ({totalPosts})
              </span>
            </p>
          ) : null}
          {searchTerm.length !== 0 ? (
            <p className="text-[16px] ml-[8px] font-black text-left text-brand-primary-500">
              &rsquo;{searchTerm}&rsquo;
              <span className="text-brand-gray-1000"> 에 대한 검색 결과</span>
              <span className="text-brand-gray-600 ml-[8px]">
                ({categoryFilterPosts.length})
              </span>
            </p>
          ) : null}
        </div>

        {/* 모바일 버전 검색 결과 */}
        <div className="flex desktop:hidden">
          {isSearchOpen && searchTerm.length === 0 ? (
            <p className="text-[14px] ml-[8px] text-left">
              전체
              <span className="text-brand-gray-600 ml-[8px]">
                ({categoryFilterPosts.length})
              </span>
            </p>
          ) : null}
          {isSearchOpen && searchTerm.length !== 0 ? (
            <p className="text-[14px] ml-[8px] text-left text-brand-primary-500">
              &rsquo;{searchTerm}&rsquo;
              <span className="text-brand-gray-1000">에 대한 검색 결과</span>
              <span className="text-brand-gray-600 ml-[8px]">
                ({categoryFilterPosts.length})
              </span>
            </p>
          ) : null}
        </div>

        {/* 게시글 리스트 그리는 곳 */}
        {categoryFilterPosts.length > 0 ? (
          categoryFilterPosts.map((item) => {
            return <PostItem item={item} key={item.id}></PostItem>;
          })
        ) : (
          // 게시글 검색 결과 없을 시
          <PostSearchFail
            searchTerm={searchTerm}
            resultCount={categoryFilterPosts.length}
          ></PostSearchFail>
        )}
      </div>
      {totalPages > 1 && categoryFilterPosts.length > 0 && (
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
