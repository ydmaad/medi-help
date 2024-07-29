"use client";

import { Tables } from "@/types/supabase";

import Link from "next/link";
import React, { useEffect } from "react";

type Post = Tables<"posts">;
interface ListProps {
  searchTerm: string;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const fetchPosts = async () => {
  const res = await fetch(`/api/community/`);
  const data = await res.json();
  return data;
};

const List: React.FC<ListProps> = ({ searchTerm, posts, setPosts }) => {
  useEffect(() => {
    const fetchData = async () => {
      // console.log("검색어가 업데이트 돼는 부분!?!?", searchTerm);
      try {
        const response = await fetchPosts();
        setPosts(response.data);
      } catch (error) {
        console.log("에러가 났네요 =>", error);
      }
    };
    fetchData();
  }, [searchTerm]);
  // console.log(posts);

  const filteredPosts = posts
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.contents.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <>
      <Link href={`/community/post`}></Link>
      {/* <Link href={`/community/${id}`}></Link> */}
      <h1 className="text-3xl font-bold mb-6">게시글 목록</h1>
      <ul className="flex flex-wrap">
        {filteredPosts.map((item) => (
          <li key={item.id}>
            {/* 상세페이지로 이동 */}
            <Link
              href={`/community/${item.id}`}
              className="block hover:bg-gray-50 transition duration-150 ease-in-out w-[300px] h-[300px] border-4 p-4 m-4 "
            >
              <h2 className="text-xl font-semibold mb-2"> {item.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-6">{item.contents}</p>
              <div className="flex items-center space-x-2">
                {/* <div className="w-5 h-5 overflow-hidden"> */}
                {/* <Image
                    src={item?.avatar}
                    alt="user_img"
                    width={20}
                    height={20}
                    className="rounded-full object-cover w-full h-full"
                  /> */}
                {/* </div> */}
                <div>{item.nickname}</div>
              </div>
              <div>
                {(() => {
                  const date = new Date(item.created_at);
                  const koreaTime = new Date(
                    date.getTime() + 9 * 60 * 60 * 1000
                  );
                  const formattedDate = koreaTime
                    .toISOString()
                    .slice(0, 16)
                    .replace("T", " ");
                  return formattedDate;
                })()}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default List;
