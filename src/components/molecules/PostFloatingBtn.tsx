import Image from "next/image";
import Link from "next/link";
import React from "react";

interface PostFloatingBtnProps {
  onUserCheck: React.MouseEventHandler<HTMLAnchorElement>;
}

const PostFloatingBtn = ({ onUserCheck }: PostFloatingBtnProps) => {
  return (
    <>
      <Link
        href={`/community/post`}
        onClick={onUserCheck}
        className="desktop:hidden fixed right-10 bottom-16 bg-brand-primary-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-brand-primary-600"
      >
        <Image
          src="/postButton.svg"
          alt="플로팅버튼"
          width={30}
          height={30}
        ></Image>
      </Link>
    </>
  );
};

export default PostFloatingBtn;
