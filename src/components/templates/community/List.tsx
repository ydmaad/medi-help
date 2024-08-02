"use client";

import { Tables } from "@/types/supabase";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

type Post = Tables<"posts">;
type User = Tables<"users">;
type PostWithUser = Post & { user: Pick<User, "avatar" | "nickname"> };

interface ListProps {
  searchTerm: string;
  posts: PostWithUser[];
  setPosts: React.Dispatch<React.SetStateAction<PostWithUser[]>>;
}

// 게시글 불러오는 요청
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
  }, [searchTerm, setPosts]);
  // console.log(posts);

  // 게시글 검색
  const filteredPosts = posts
    ? posts
        .filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.contents.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    : [];

  // img_url을 배열로 만드는 함수
  const getImageUrls = (urlString: string | null): string[] => {
    return urlString ? urlString.split(",").map((url) => url.trim()) : [];
  };

  return (
    <>
      <Link href={`/community/post`}></Link>
      {/* <Link href={`/community/${id}`}></Link> */}

      <ul className="space-y-4">
        {filteredPosts.map((item) => {
          const imageUrls = getImageUrls(item.img_url);
          return (
            <li key={item.id} className="border p-4 w-[1000px] h-[150px] my-5">
              {/* 상세페이지로 이동 */}
              <Link
                href={`/community/${item.id}`}
                className="block hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <div className="flex justify-between">
                  <div className="flex-grow pr-4">
                    <h2 className="text-xl font-semibold mb-2">
                      {" "}
                      {item.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-2 h-[48px]">
                      {item.contents}
                    </p>
                    {/* <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        <Image
                          src={
                            (item.user.avatar as string) ||
                            "/default-avatar.jpg"
                          }
                          alt="user_img"
                          width={20}
                          height={20}
                          className="rounded-full object-cover w-10 h-10 mr-2"
                        />
                        <span>{item.user.nickname}</span>
                      </div>
                    </div> */}
                    <div className="text-sm text-gray-500 mt-4">
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                  {imageUrls.length > 0 && (
                    <div className="w-24 h-24 flex-shrink-0">
                      <Image
                        src={imageUrls[0]}
                        alt="Post image"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full rounded"
                      />
                    </div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default List;
