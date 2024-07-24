"use client";

import { Tables } from "@/types/supabase";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Post = Tables<"test_posts">;

const fetchPost = async () => {
  const res = await fetch(`/api/community/`);
  const data = await res.json();
  return data;
};

const List = () => {
  // route.ts에 불러온 데이터를 이용하여 게시글을 보여주는 컴포넌트

  const [post, setPost] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reponse = await fetchPost();
        setPost(reponse.data);
      } catch (error) {
        console.log("에러가 났네요 =>", error);
      }
    };
    fetchData();
  }, []);

  console.log(post);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">게시글 목록</h1>
      <ul>
        {post.map((item) => (
          <li key={item.id}>
            <Link
              href={`/community/${item.id}`}
              className="block hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              <h2> {item.title}</h2>
              <p>{item.contents}</p>
              <div>
                <Image
                  src={item?.avatar}
                  alt="user_img"
                  width={20}
                  height={20}
                />
              </div>
              <span>{item.nickname}</span>
              <span>{item.created_at}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default List;
