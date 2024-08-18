import Image from "next/image";
import React from "react";

interface PostSearchFailProps {
  searchTerm: string;
  resultCount: number;
}

const PostSearchFail = ({ searchTerm, resultCount }: PostSearchFailProps) => {
  return (
    <div>
      {/* 웹 버전 */}
      <div className="hidden desktop:flex items-center justify-center h-[400px] text-center">
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

      {/* 모바일 버전 */}
      <div className="flex desktop:hidden items-center justify-center text-center flex-col mt-[205px] mb-[248px]">
        <Image
          src={"/searchFail.svg"}
          alt="검색결과 없음 이미지"
          width={70}
          height={104}
          className="mb-[18px]"
        ></Image>
        <p className="text-[16px] font-semibold text-brand-gray-600">
          검색 결과를 찾을 수 없어요
        </p>
      </div>
    </div>
  );
};

export default PostSearchFail;
