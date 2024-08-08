"use client";

import List from "@/components/templates/community/List";
import Search from "@/components/templates/community/Search";
import { useAuthStore } from "@/store/auth";
import { Tables } from "@/types/supabase";
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
      <div className="max-w-[1000px] mx-auto mt-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={handleReset} className="text-3xl font-bold">
              커뮤니티
            </button>

            <Search handleSearch={handleSearch} />
          </div>
          <Link
            href={`/community/post`}
            onClick={handleUserCheck}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span>글쓰기</span>
          </Link>
        </div>
        <List searchTerm={searchTerm} posts={posts} setPosts={setPosts} />
      </div>
    </>
  );
};
export default CommunityPage;
