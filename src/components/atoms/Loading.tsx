import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Image
            src="/loading.gif"
            alt="로딩중이미지"
            width={160}
            height={160}
          ></Image>
          <p className="text-[16px] text-brand-gray-1000">로딩중이에요...!!</p>
        </div>
      </div>
    </>
  );
};

export default Loading;
