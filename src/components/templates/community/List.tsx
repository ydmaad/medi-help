"use client";

import Pagination from "@/components/molecules/Pagination";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  searchResults: PostWithUser[];
  allPosts: PostWithUser[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPosts: number;
  sortOption: string;
  setSortOption: (option: string) => void;
}

const List = ({
  searchTerm,
  posts,
  setPosts,
  searchResults,
  allPosts,
  currentPage,
  totalPages,
  onPageChange,
  setCurrentPage,
  totalPosts,
  sortOption,
  setSortOption,
}: ListProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectCategory, setSelectCategory] = useState<string>("전체");
  const category = ["전체", "메디톡", "궁금해요", "건강 꿀팁"];
  const { isSearchOpen } = useCommunitySearchFlagStore();

  useEffect(() => {
    setIsLoading(true);
    allPosts;
    setIsLoading(false);
  });

  // console.log(allPosts);

  // 카테고리 선택 함수
  useEffect(() => {
    if (allPosts) {
      if (selectCategory === "전체") {
        setPosts(allPosts);
      } else {
        const categoryData = allPosts.filter(
          (post: PostWithUser) => post.category === selectCategory
        );
        setPosts(categoryData);
      }
    }
  }, [allPosts, selectCategory]);

  // 카테고리 선택 핸들러
  const handleCategorySelect = (category: string) => {
    setSelectCategory(category);
    setCurrentPage(1);
  };

  console.log(searchTerm);

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
        {!isSearchOpen && !searchTerm && (
          <div className="flex justify-between">
            <CategorySelect
              categories={category}
              selectCategory={selectCategory}
              onSelectCategory={handleCategorySelect}
            />
            <SortOption
              sortOption={sortOption}
              setSortOption={setSortOption}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}

        <div className="hidden desktop:flex mb-[8px]">
          <p className="text-[16px] ml-[8px] text-left">
            {searchTerm ? (
              <>
                <span className="font-black text-brand-primary-500">
                  &rsquo;{searchTerm}&rsquo;
                </span>
                <span className="text-brand-gray-1000"> 에 대한 검색 결과</span>
              </>
            ) : selectCategory === "전체" ? (
              "전체"
            ) : (
              selectCategory
            )}
            <span className="text-brand-gray-600 ml-[8px]">({totalPosts})</span>
          </p>
        </div>

        {posts && posts.length > 0 ? (
          posts.map((item) => <PostItem item={item} key={item.id} />)
        ) : (
          <PostSearchFail searchTerm={searchTerm} resultCount={0} />
        )}
      </div>
      {!searchTerm && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default List;
