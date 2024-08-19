import Image from "next/image";
import Link from "next/link";
import React from "react";

const Error = () => {
  return (
    <>
      <div>
        <Image src="/error.svg" alt="404에러" width={161} height={111}></Image>
        <p>페이지를 찾을 수 없어요</p>
        <p>요청하신 페이지가 없거나 이용할 수 없는 페이지예요.</p>
        <Link href={"/"}>
          <button>홈으로 돌아가기</button>
        </Link>
      </div>
    </>
  );
};

export default Error;
