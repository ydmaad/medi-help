import Image from "next/image";
import Link from "next/link";
import React from "react";

interface PostHeaderProps {
  onAddPost: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const PostHeader = ({ onAddPost }: PostHeaderProps) => {
  return (
    <div className="flex desktop:hidden justify-between space-x-4 mb-6 ">
      <Link href={`/community/`}>
        <Image
          src="/postCancel.svg"
          alt="게시글등록취소"
          width={26}
          height={26}
        ></Image>
      </Link>
      <div className=" text-center ">
        <h1 className="text-[18px] font-black ">글쓰기</h1>
      </div>
      <button
        onClick={onAddPost}
        className="text-[18px] text-brand-primary-500  hover:text-brand-primary-700"
      >
        등록
      </button>
    </div>
  );
};

export default PostHeader;
