"use client";

import List from "@/components/templates/community/List";
import Search from "@/components/templates/community/Search";
import { useAuthStore } from "@/store/auth";
import { Tables } from "@/types/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Post = Tables<"posts">;
type User = Tables<"users">;

type PostWithUser = Post & { user: Pick<User, "avatar" | "nickname"> } & {
  comment_count: number;
  bookmark_count: number;
};

const CommunityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [allPosts, setAllPosts] = useState<PostWithUser[]>([]);
  const { user } = useAuthStore();
  const router = useRouter();

  const fectchAllPosts = async () => {
    const res = await fetch(`/api/community`);
    const data = await res.json();
    setAllPosts(data);
  };

  useEffect(() => {
    fectchAllPosts();
  }, []);

  const handleReset = () => {
    setSearchTerm("");
    allPosts;
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // console.log("검색어가 업데이트 돼는 부분!?!?", term);
  };

  // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
  const handleUserCheck = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
    } else {
      router.push("/community/post");
    }
  };

  return (
    <>
      <div className="max-w-[1000px] mx-auto mt-40">
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col">
            <button
              onClick={handleReset}
              className="flex items-center text-3xl font-bold"
            >
              <span className="mr-3">&#128172;</span>
              커뮤니티
            </button>
            <span className="text-brand-gray-600 font-extrabold mt-2">
              약에 대한 이야기를 나누어 보아요
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Search handleSearch={handleSearch} />
            {/* 데스크톱 버전 (1280px 이상에서 표시) */}
            <Link
              href={`/community/post`}
              onClick={handleUserCheck}
              className="hidden desktop:flex bg-brand-primary-500 text-white px-7 py-2 rounded-md shadow-sm hover:bg-brand-primary-600 items-center space-x-2"
            >
              <span>글쓰기</span>
            </Link>

            {/* 모바일/태블릿 버전 (1280px 미만에서 표시) */}
            <Link
              href={`/community/post`}
              onClick={handleUserCheck}
              className="desktop:hidden fixed right-4 bottom-20 bg-brand-primary-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-brand-primary-600"
            >
              <Image
                src="/postButton.svg"
                alt="플로팅버튼"
                width={30}
                height={30}
              ></Image>
            </Link>
          </div>
        </div>
        <List searchTerm={searchTerm} posts={posts} setPosts={setPosts} />
      </div>
    </>
  );
};
export default CommunityPage;
