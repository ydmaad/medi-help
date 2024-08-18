import React from "react";

export const PostListSkeleton = () => {
  return (
    <li className="border p-4 w-full h-[150px] my-10 animate-pulse">
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

export const PostDetailSkeleton = () => {
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
