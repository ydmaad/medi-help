import Image from "next/image";
import React from "react";

interface PostSearchFailProps {
  searchTerm: string;
  resultCount: number;
}

const PostSearchFail = ({ searchTerm, resultCount }: PostSearchFailProps) => {
  return (
    <div>
      <p className="text-brand-gray-1000 font-black text-xl mt-20">
        <span className="text-brand-primary-500">&quot;{searchTerm}&quot;</span>{" "}
        에 대한 검색 결과
        <span className="text-brand-gray-600">({resultCount})</span>
      </p>

      <div className="flex items-center justify-center h-[400px] text-center">
        <Image
          src={"/searchFail.svg"}
          alt="검색결과 없음 이미지"
          width={70}
          height={104}
          className="mx-4"
        ></Image>
        <p className="text-2xl font-semibold text-brand-gray-600 mb-4">
          해당 검색에 대한 결과를 찾을 수 없어요.
        </p>
      </div>
    </div>
  );
};

export default PostSearchFail;
