"use client";

import { useEffect, useState } from "react";

const fetchPost = async () => {
  const res = await fetch(`/api/community/`);
  const data = await res.json();
  return data;
};

const List = () => {
  // route.ts에 불러온 데이터를 이용하여 게시글을 보여주는 컴포넌트
  const [post, setPost] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPost();
        setPost(data);
        console.log(post);
      } catch (error) {
        console.log("에러가 났네요 =>", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* map 넣을 예정 */}
      <div>제목</div>
      <div>작성자</div>
      <div>작성일</div>
      <div>내용</div>
      <div>이미지</div>
    </>
  );
};

export default List;
