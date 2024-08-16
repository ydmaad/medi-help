import Link from "next/link";
import React from "react";

interface PostBtnProps {
  onAddPost: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const PostBtnDesk = ({ onAddPost }: PostBtnProps) => {
  return (
    <div className="hidden desktop:flex justify-center space-x-4  ">
      <Link
        href={`/community/`}
        className="bg-brand-primary-50 text-brand-primary-500 w-[100px] px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 inline-flex items-center justify-center"
      >
        취소
      </Link>
      <button
        onClick={onAddPost}
        className="bg-brand-primary-500 text-white w-[100px] px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
      >
        작성
      </button>
    </div>
  );
};
